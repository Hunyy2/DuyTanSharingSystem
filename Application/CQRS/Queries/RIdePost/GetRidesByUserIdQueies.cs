﻿
namespace Application.CQRS.Queries.RIdePost
{
    public class GetRidesByUserIdQueries : IRequest<ResponseModel<GetAllRideResponseDto>>
    {
        public Guid UserId { get; set; } // Thêm UserId vào query
        public Guid? NextCursor { get; set; }
        public int? PageSize { get; set; }

        public GetRidesByUserIdQueries(Guid userId, Guid? nextCursor = null, int? pageSize = null)
        {
            UserId = userId;
            NextCursor = nextCursor;
            PageSize = pageSize;
        }
    }
}
