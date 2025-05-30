﻿


namespace Infrastructure.Data.Repositories
{
    public class AIConversationRepository : BaseRepository<AIConversation>, IAIConversationRepository
    {
        public AIConversationRepository(AppDbContext context) : base(context)
        {
        }

        public override async Task<bool> DeleteAsync(Guid id)
        {
            var conversation = await _context.AIConversations.FindAsync(id);
            var chatHistories = await _context.AIChatHistories
                .Where(x => x.ConversationId == id)
                .ToListAsync();
            if (chatHistories.Any())
            {
                _context.AIChatHistories.RemoveRange(chatHistories);
            }
            if (conversation == null)
                return false;
            _context.AIConversations.Remove(conversation);
            
            return true;
        }

        public async Task<AIConversation?> GetByIdAsync(Guid? id)
        {
            if (id == null)
                return null;
            var conversation = await _context.AIConversations
                .FirstOrDefaultAsync(x => x.Id == id);
            return conversation ?? null;
        }

        public async Task<AIConversation?> GetConversationByUserId(Guid userId)
        {
            return await _context.AIConversations
                .FirstOrDefaultAsync(x => x.UserId == userId);
        }

        public async Task<List<AIConversation>> GetConversationsByUserId(Guid userId, Guid? lastConversationId, int pageSize)
        {
            const int MAX_PAGE_SIZE = 50;
            pageSize = Math.Min(pageSize, MAX_PAGE_SIZE);

            var query = _context.AIConversations
                .Where(x => x.UserId == userId)
                .AsQueryable();

            if (lastConversationId.HasValue)
            {
                var lastConversation = await _context.AIConversations.FindAsync(lastConversationId.Value);
                if (lastConversation != null)
                {
                    query = query.Where(x => x.CreatedAt < lastConversation.CreatedAt);
                }
            }

            var result = await query
                .OrderByDescending(x => x.CreatedAt)
                .Take(pageSize)
                .ToListAsync();

            return result;
        }



    }
}
