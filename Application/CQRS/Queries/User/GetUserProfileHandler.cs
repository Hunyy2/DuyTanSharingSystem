using Application.DTOs.User;
using Application.Interface.ContextSerivce;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.CQRS.Queries.User
{
    public class GetUserProfileHandler : IRequestHandler<GetUserProfileQuery, ResponseModel<UserProfileDto>>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserContextService _userContextService;
        public GetUserProfileHandler(IUnitOfWork unitOfWork, IUserContextService userContextService)
        {
            _unitOfWork = unitOfWork;
            _userContextService = userContextService;
        }
        public async Task<ResponseModel<UserProfileDto>> Handle(GetUserProfileQuery request, CancellationToken cancellationToken)
        {
            var userid = _userContextService.UserId();
            if (userid == null)
            {
                return ResponseFactory.Fail<UserProfileDto>("User not found", 404);
            }
            var user = await _unitOfWork.UserRepository.GetByIdAsync(userid);

            if (user == null)
            {
                throw new ArgumentException("User not found");
            }
            return ResponseFactory.Success(new UserProfileDto
            {
                Id = user.Id,
                Email = user.Email,
                FullName = user.FullName,
                ProfilePicture = user.ProfilePicture,
                Bio = user.Bio,
                CreatedAt = user.CreatedAt,

            }, "Get user profile success", 200);


        }
    }
}
