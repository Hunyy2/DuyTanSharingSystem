using System.Collections.Concurrent;
using System.Security.Claims;
namespace Infrastructure.Hubs
{
    //class dùng để thực hiện chức năng chat signal người với người,và phát hiện trạng thái online
    public class ChatHub : Hub
    {

        private readonly IRedisService _redisService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly TimeSpan _statusExpiration = TimeSpan.FromMinutes(15);
        private readonly IMessageStatusService _messageStatusService;
        private static readonly ConcurrentDictionary<string, Guid> _connectedUsers = new ConcurrentDictionary<string, Guid>();

        public ChatHub(IRedisService redisService, IUnitOfWork unitOfWork, IMessageStatusService messageStatusService)
        {
            _redisService = redisService;
            _unitOfWork = unitOfWork;
            _messageStatusService = messageStatusService;
            Console.OutputEncoding = System.Text.Encoding.UTF8;
        }
        //public override async Task OnConnectedAsync()
        //{
        //    await base.OnConnectedAsync(); // Rất quan trọng để SignalR xử lý nội bộ
        //}

        //public override async Task OnDisconnectedAsync(Exception? exception)
        //{
        //    await base.OnDisconnectedAsync(exception); // Rất quan trọng để SignalR xử lý nội bộ
        //}
        public override async Task OnConnectedAsync()
        {
            var userIdString = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var userId) || userId == Guid.Empty)
            {
                Context.Abort(); // Ngắt kết nối nếu UserId không hợp lệ
                Console.WriteLine("UserId không hợp lệ trong OnConnectedAsync, abort kết nối");
                return;
            }

            Console.WriteLine($"🔗 Client kết nối: ConnectionId: {Context.ConnectionId}, UserId: {userId}");

            // 1. Thêm ConnectionId vào Group của UserId để dễ dàng gửi tin nhắn tới User
            await Groups.AddToGroupAsync(Context.ConnectionId, userId.ToString());
            Console.WriteLine($"👥 Đã thêm ConnectionId {Context.ConnectionId} vào group {userId}");

            // 2. Lưu trữ ConnectionId và UserId vào ConcurrentDictionary cục bộ
            // Đây là bước quan trọng để theo dõi các kết nối đang hoạt động trên Server Hub instance hiện tại
            _connectedUsers.TryAdd(Context.ConnectionId, userId);

            // 3. Lưu trữ ConnectionId vào Redis Set cho UserId đó
            // Redis Set giúp đảm bảo mỗi ConnectionId là duy nhất và dễ dàng thêm/xóa
            await _redisService.AddToSetAsync($"user_connections:{userId}", Context.ConnectionId);

            // 4. Đặt trạng thái online cho User trong Redis với một thời gian hết hạn (ví dụ 30 giây)
            // Thời gian này sẽ được làm mới bởi client qua phương thức KeepAlive
            await _redisService.SaveDataAsync($"user_status:{userId}", "online", TimeSpan.FromSeconds(30));
            Console.WriteLine($"⚡️ Đặt trạng thái online cho user {userId} với expire 30s");

            // 5. Lấy danh sách bạn bè của người dùng (từ Redis hoặc DB nếu Redis không có)
            var friends = await _redisService.GetFriendsAsync(userId.ToString());
            if (!friends.Any())
            {
                // Nếu Redis chưa có danh sách bạn bè, đồng bộ từ Database lên Redis
                await _redisService.SyncFriendsToRedis(userId.ToString());
                friends = await _redisService.GetFriendsAsync(userId.ToString());
            }

            // 6. Thông báo cho tất cả bạn bè biết người dùng này đã online
            Console.WriteLine($"Gửi UserOnline cho bạn bè của {userId}: {string.Join(", ", friends)}");
            foreach (var friendIdStr in friends)
            {
                if (Guid.TryParse(friendIdStr, out var friendId) && friendId != userId)
                {
                    // Kiểm tra xem người bạn đó có đang online không trước khi gửi
                    // Mặc dù `Clients.Group` sẽ chỉ gửi đến các kết nối đang hoạt động,
                    // việc kiểm tra `IsUserOnlineAsync` giúp tránh gửi quá nhiều sự kiện không cần thiết
                    if (await _redisService.IsUserOnlineAsync(friendId.ToString()))
                    {
                        await Clients.Group(friendId.ToString()).SendAsync("UserOnline", userId.ToString());
                        Console.WriteLine($"📤 Đã gửi UserOnline đến {friendId}");
                    }
                }
            }

            // 7. Gửi danh sách bạn bè đang online cho người dùng vừa kết nối
            // Điều này giúp client cập nhật trạng thái ban đầu của bạn bè khi mới vào
            var onlineFriends = new List<string>();
            foreach (var friendIdStr in friends)
            {
                if (Guid.TryParse(friendIdStr, out var friendId) && friendId != userId)
                {
                    if (await _redisService.IsUserOnlineAsync(friendId.ToString()))
                    {
                        onlineFriends.Add(friendId.ToString());
                    }
                }
            }
            await Clients.Caller.SendAsync("InitialOnlineFriends", onlineFriends);
            Console.WriteLine($"Gửi InitialOnlineFriends cho {userId}: {string.Join(", ", onlineFriends)}");

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var userIdString = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var userId) || userId == Guid.Empty)
            {
                Console.WriteLine("UserId không hợp lệ trong OnDisconnectedAsync");
                await base.OnDisconnectedAsync(exception);
                return;
            }

            Console.WriteLine($"🔌 Client ngắt kết nối: ConnectionId: {Context.ConnectionId}, UserId: {userId}, Lý do: {exception?.Message ?? "Không rõ"}");

            // 1. Xóa ConnectionId khỏi ConcurrentDictionary cục bộ
            _connectedUsers.TryRemove(Context.ConnectionId, out _);

            // 2. Xóa ConnectionId khỏi Redis Set của User
            await _redisService.RemoveFromSetAsync($"user_connections:{userId}", Context.ConnectionId);

            // 3. Kiểm tra xem User còn ConnectionId nào khác không trong Redis Set
            var remainingConnectionsCount = await _redisService.GetSetAsync($"user_connections:{userId}");

            if (remainingConnectionsCount == null || !remainingConnectionsCount.Any())
            {
                Console.WriteLine($"🗑️ Không còn kết nối nào cho user {userId}, đánh dấu offline");

                // 4. Nếu không còn kết nối nào, đặt trạng thái offline và lưu thời gian "last seen"
                await _redisService.RemoveDataAsync($"user_status:{userId}"); // Xóa trạng thái online
                await _redisService.SaveDataAsync($"user_last_seen:{userId}", DateTime.UtcNow.ToString("o"), TimeSpan.FromHours(24));

                // 5. Thông báo cho bạn bè rằng người dùng đã offline
                var friends = await _redisService.GetFriendsAsync(userId.ToString());
                Console.WriteLine($"Gửi UserOffline cho bạn bè của {userId}: {string.Join(", ", friends)}");
                foreach (var friendIdStr in friends)
                {
                    if (Guid.TryParse(friendIdStr, out var friendId) && friendId != userId)
                    {
                        // Chỉ gửi tín hiệu "UserOffline" nếu người bạn đó đang online
                        // Điều này giúp tránh gửi sự kiện đến các client không cần biết
                        if (await _redisService.IsUserOnlineAsync(friendId.ToString()))
                        {
                            await Clients.Group(friendId.ToString()).SendAsync("UserOffline", userId.ToString());
                            Console.WriteLine($"📤 Đã gửi UserOffline đến {friendId}");
                        }
                    }
                }
            }
            else
            {
                Console.WriteLine($"⚠️ Vẫn còn {remainingConnectionsCount.Count} kết nối cho user {userId}");
            }

            await base.OnDisconnectedAsync(exception);
        }

        /// <summary>
        /// Client gọi hàm này định kỳ (ví dụ mỗi 15-20 giây) để làm mới trạng thái online.
        /// </summary>
        public async Task KeepAlive()
        {
            var userIdString = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var userId))
            {
                Console.WriteLine("KeepAlive: UserId không hợp lệ");
                return;
            }

            // Kiểm tra xem ConnectionId hiện tại có hợp lệ với userId không (từ bộ nhớ cục bộ trước)
            if (_connectedUsers.TryGetValue(Context.ConnectionId, out var storedUserId) && storedUserId == userId)
            {
                // Kiểm tra lại trong Redis Set để đảm bảo ConnectionId vẫn tồn tại
                // Điều này hữu ích nếu có sự cố với ConcurrentDictionary (ví dụ: Hub instance bị tái tạo)
                var isMember = await _redisService.IsMemberOfSetAsync($"user_connections:{userId}", Context.ConnectionId);

                if (isMember)
                {
                    // Làm mới thời gian tồn tại của khóa user_status:{userId} trong Redis
                    // Điều này giữ cho trạng thái "online" được duy trì.
                    await _redisService.SaveDataAsync($"user_status:{userId}", "online", TimeSpan.FromSeconds(30)); // Đặt lại 30 giây
                    Console.WriteLine($"🔄 Làm mới trạng thái online cho user {userId} từ KeepAlive. ConnectionId: {Context.ConnectionId}");
                }
                else
                {
                    Console.WriteLine($"⚠️ KeepAlive: ConnectionId {Context.ConnectionId} không tồn tại trong Redis Set cho user {userId}. Ngắt kết nối.");
                    Context.Abort(); // Ngắt kết nối nếu ConnectionId không còn trong Redis Set
                }
            }
            else
            {
                // Nếu ConnectionId không khớp hoặc không tồn tại trong bản đồ cục bộ, có thể là lỗi hoặc kết nối cũ
                Console.WriteLine($"⚠️ KeepAlive: ConnectionId {Context.ConnectionId} không hợp lệ hoặc không khớp với user {userId}. Ngắt kết nối.");
                Context.Abort(); // Ngắt kết nối để client thử kết nối lại đúng cách
            }
        }
        public async Task JoinConversation(string conversationId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, conversationId);
        }

        public async Task LeaveConversation(string conversationId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, conversationId);
        }

        public async Task SendMessageToConversation(string conversationId, MessageDto message)
        {
            await Clients.Group(conversationId).SendAsync("ReceiveMessage", message);
        }
        public async Task SendTyping(string conversationId, string friendId)
        {
            var userIdString = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var userId) || userId == Guid.Empty)
            {
                return;
            }

            if (!Guid.TryParse(conversationId, out var convIdGuid) || !Guid.TryParse(friendId, out var friendGuid))
            {
                return;
            }

            // Gửi trực tiếp đến người bạn kia, thay vì dùng OthersInGroup
            await Clients.User(friendGuid.ToString()).SendAsync("UserTyping", userId.ToString());
        }

        public async Task MarkMessagesAsSeen(string messageId,MessageStatus status)
        {
            var userIdString = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var userId) || userId == Guid.Empty)
            {
                Console.WriteLine("MarkMessagesAsSeen: UserId không hợp lệ");
                return;
            }

            if (!Guid.TryParse(messageId, out var messIdGuid))
            {
                Console.WriteLine($"MarkMessagesAsSeen: ConversationId không hợp lệ: {messageId}");
                return;
            }

            Console.WriteLine($"User {userId} đánh dấu đã xem conversation {messIdGuid}");

            // --- GỌI SERVICE ĐỂ CẬP NHẬT TRẠNG THÁI SEEN ---
            try
            {
                await _messageStatusService.MarkMessagesAsync(messIdGuid, userId,status);
                Console.WriteLine($"✅ Đã xử lý cập nhật Seen status trong conversation {messIdGuid} theo yêu cầu của user {userId}.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Lỗi khi xử lý MarkMessagesAsSeenAsync cho conversation {messIdGuid}, reader {userId}: {ex.Message}");
                // Ghi log chi tiết lỗi
            }       
        }
        
    }
}
