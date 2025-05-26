import { useCallback, useEffect, useMemo, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import avatarDefault from "../../assets/AvatarDefault.png";
import { fetchFriends } from "../../stores/action/friendAction";
import { setActiveFriend } from "../../stores/reducers/friendReducer";
import {
  setUserOffline,
  setUserOnline,
} from "../../stores/reducers/onlineSlice";
import Spinner from "../../utils/Spinner";
import signalRService from "../../Service/signalRService";
import "../../styles/MessageView/RightSidebar.scss";
import ChatBox from "../MessageComponent/ChatBox";

import {
  useChatHandle,
  useMessageReceiver,
  useMessageReceiverData,
} from "../../utils/MesengerHandle";
import {
  getConversationss,
  getInbox,
  getMessagess,
} from "../../stores/action/messageAction";

import {
  openChatBox,
  closeChatBox,
  resetMessages,
  setSelectFriend,
} from "../../stores/reducers/messengerReducer";

const RightSidebar = () => {
  const dispatch = useDispatch();

  //Các hàm tin nhắn từ chat handle
  const {
    handleJoin,
    handleLeaveChat,
    handleSendMessage,
    markConversationAsSeen,
  } = useChatHandle();

  const {
    friends,
    loading: friendsLoading,
    error: friendsError,
  } = useSelector((state) => state.friends);
  const {
    onlineStatus,
    loading: onlineLoading,
    error: onlineError,
  } = useSelector((state) => state.onlineUsers);

  const [openChats, setOpenChats] = useState([]);
  const [activeFriend, setActiveFriendLocal] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // Thêm state cho từ khóa tìm kiếm

  useEffect(() => {
    dispatch(fetchFriends());

    signalRService.onUserOnline((userId) => {
      console.log("Nhận sự kiện userOnline:", userId);
      dispatch(setUserOnline(userId));
    });

    signalRService.onUserOffline((userId) => {
      console.log("Nhận sự kiện userOffline:", userId);
      dispatch(setUserOffline(userId));
    });

    signalRService.onInitialOnlineFriends((onlineUsers) => {
      console.log("Nhận initialOnlineUsers:", onlineUsers);
      onlineUsers.forEach((userId) => dispatch(setUserOnline(userId)));
    });

    return () => {
      signalRService.off("userOnline", signalRService.chatConnection);
      signalRService.off("userOffline", signalRService.chatConnection);
      signalRService.off("initialOnlineUsers", signalRService.chatConnection);
    };
  }, [dispatch]);

  useEffect(() => {
    if (friends.length > 0 && !friendsLoading && !friendsError) {
      const friendIds = friends.map((friend) => friend.friendId);
      //dispatch(checkOnlineUsers(friendIds));
    }
  }, [friends, friendsLoading, friendsError, dispatch]);

  const getLastSeenText = useCallback((lastSeen) => {
    if (!lastSeen) return "";
    const diff = (new Date() - new Date(lastSeen)) / 1000 / 60;
    if (diff < 1) return "Vừa mới hoạt động";
    if (diff < 60) return `Hoạt động ${Math.floor(diff)} phút trước`;
    return `Hoạt động ${Math.floor(diff / 60)} giờ trước`;
  }, []);

  const sortedFriends = useMemo(() => {
    return [...friends].sort((a, b) => {
      const isOnlineA = onlineStatus[a.friendId] ?? false;
      const isOnlineB = onlineStatus[b.friendId] ?? false;
      if (isOnlineA && !isOnlineB) return -1;
      if (!isOnlineA && isOnlineB) return 1;
      if (!isOnlineA && !isOnlineB) {
        const lastSeenA = new Date(a.lastSeen || 0).getTime();
        const lastSeenB = new Date(b.lastSeen || 0).getTime();
        return lastSeenB - lastSeenA;
      }
      return 0;
    });
  }, [friends, onlineStatus]);

  // Lọc danh sách bạn bè theo searchQuery
  const filteredFriends = useMemo(() => {
    return sortedFriends.filter((friend) =>
      friend.fullName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [sortedFriends, searchQuery]);

  // Xử lý thay đổi giá trị tìm kiếm
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const messengerState = useSelector((state) => state.messenges || {});

  //chọn bạn nhắn tin để mở chatbox
  const handleSelectedFriend = async (friendData) => {
    const token = localStorage.getItem("token");
    try {
      //Thoát khỏi cuộc trò chuyện nếu join vào cuộc trò chuyện nào trước đó
      if (messengerState.conversationId) {
        await handleLeaveChat(messengerState.conversationId);
      }
      // Lấy dữ liệu cuộc trò chuyện mới
      const conversationData = await dispatch(
        getConversationss({ friendId: friendData.friendId, token })
      ).unwrap();

      const conversationId = conversationData.id;

      dispatch(resetMessages());
      dispatch(setSelectFriend(friendData));

      // Tham gia cuộc trò chuyện mới qua SignalR

      await handleJoin(conversationId);
      const messages = await dispatch(
        getMessagess({
          conversationId,
          token,
          nextCursor: null,
          pageSize: 20,
        })
      );

      await markConversationAsSeen({
        conversationId: conversationId, // Dùng trực tiếp conversationId mới
        friendId: friendData.friendId, // Dùng trực tiếp friendId mới
        messages: messages.payload.data || [], // ✅ Lấy đúng mảng tin nhắn
        status: 2,
      });

      dispatch(closeChatBox());

      dispatch(openChatBox());
    } catch (error) {
      console.error("Lỗi chọn bạn để chat:", error);
    }
  };

  // if (friendsLoading || onlineLoading) {
  //   return (
  //     <aside className="right-sidebar">
  //       <p>Đang tải...</p>
  //     </aside>
  //   );
  // }

  // if (friendsError) {
  //   return (
  //     <aside className="right-sidebar">
  //       <p>Lỗi tải danh sách bạn bè: {friendsError}</p>
  //     </aside>
  //   );
  // }

  return (
    <>
      <aside className="right-sidebar">
        <div className="search-container">
          <h3>Bạn Bè</h3>
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Tìm kiếm bạn bè..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        {/* Thêm phần loading và error ở đây */}
        {(friendsLoading || onlineLoading) && (
          // <p className="loading-message">Đang tải danh sách bạn bè...</p>
          <div className="loading-message">
            <Spinner size={70} />
          </div>
        )}

        {friendsError && (
          <p className="error-message">
            Lỗi tải danh sách bạn bè: {friendsError}
          </p>
        )}

        {onlineError && (
          <p className="error-message">
            Lỗi tải trạng thái online: {onlineError}
          </p>
        )}

        <div className="friends-list">
          <ul>
            {filteredFriends.map((friend) => {
              const isOnline = onlineStatus[friend.friendId] ?? false;
              return (
                <li
                  key={friend.friendId}
                  className={activeFriend === friend.friendId ? "active" : ""}
                  onClick={() =>
                    handleSelectedFriend({
                      friendId: friend.friendId,
                      fullName: friend.fullName,
                      pictureProfile: friend.pictureProfile,
                      conversationId: 0,
                    })
                  }
                >
                  <div className="friend-info">
                    <img
                      src={friend.pictureProfile || avatarDefault}
                      alt={`${friend.fullName || "Bạn bè"}'s avatar`}
                    />
                    <div className="name-status">
                      <div className="friend-name">
                        {friend.fullName || "Không tên"}
                      </div>
                      <div className="status-container">
                        <span
                          className={`status-dot ${
                            isOnline ? "online" : "offline"
                          }`}
                        ></span>
                        <span className="status-text">
                          {isOnline
                            ? "Online"
                            : getLastSeenText(friend.lastSeen)}
                        </span>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
            {filteredFriends.length === 0 &&
              !(friendsLoading || onlineLoading || friendsError) && (
                <div className="loading-error">Không tìm thấy bạn bè.</div>
              )}
          </ul>
        </div>
      </aside>
    </>
  );
};

export default RightSidebar;

// return (
//     <>
//       <aside className="right-sidebar">
//         <div className="search-container">
//           <h3>Bạn Bè</h3>
//           <div className="search-box">
//             <FiSearch className="search-icon" />
//             <input
//               type="text"
//               placeholder="Tìm kiếm bạn bè..."
//               value={searchQuery}
//               onChange={handleSearchChange}
//             />
//           </div>
//         </div>
//         {onlineError && (
//           <p className="error-message">
//             Lỗi tải trạng thái online: {onlineError}
//           </p>
//         )}
//         <div className="friends-list">
//           <ul>
//             {filteredFriends.map((friend) => {
//               const isOnline = onlineStatus[friend.friendId] ?? false;
//               return (
//                 <li
//                   key={friend.friendId}
//                   className={activeFriend === friend.friendId ? "active" : ""}
//                   onClick={() =>
//                     handleSelectedFriend({
//                       friendId: friend.friendId,
//                       fullName: friend.fullName,
//                       pictureProfile: friend.pictureProfile,
//                       conversationId: 0,
//                     })
//                   }
//                 >
//                   <div className="friend-info">
//                     <img
//                       src={friend.pictureProfile || avatarDefault}
//                       alt={`${friend.fullName || "Bạn bè"}'s avatar`}
//                     />
//                     <div className="name-status">
//                       <div className="friend-name">
//                         {friend.fullName || "Không tên"}
//                       </div>
//                       <div className="status-container">
//                         <span
//                           className={`status-dot ${
//                             isOnline ? "online" : "offline"
//                           }`}
//                         ></span>
//                         <span className="status-text">
//                           {isOnline
//                             ? "Online"
//                             : getLastSeenText(friend.lastSeen)}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </li>
//               );
//             })}
//             {filteredFriends.length === 0 && (
//               <div className="loading-error">Không tìm thấy bạn bè.</div>
//             )}
//           </ul>
//         </div>
//       </aside>
//     </>
//   );
