﻿using Application.DTOs.Ride;
using static Domain.Common.Helper;
using Application.Interface.ContextSerivce;
using Domain.Entities;
using static Domain.Common.Enums;

namespace Application.CQRS.Commands.Rides
{
    public class CreateRideCommandHandler : IRequestHandler<CreateRideCommand, ResponseModel<ResponseRideDto>>
    {
        private readonly IUserContextService _userContextService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IRidePostService _ridePostService;
        public CreateRideCommandHandler(IUserContextService userContextService, IUnitOfWork unitOfWork, IRidePostService ridePostService)
        {
            _userContextService = userContextService;
            _unitOfWork = unitOfWork;
            _ridePostService = ridePostService;
        }
        public async Task<ResponseModel<ResponseRideDto>> Handle(CreateRideCommand request, CancellationToken cancellationToken)
        {
            var userId = _userContextService.UserId();
            if (userId == Guid.Empty)
                return ResponseFactory.Fail<ResponseRideDto>("User not found", 404);

            var ridePost = await _unitOfWork.RidePostRepository.GetByIdAsync(request.RidePostId);
            if (userId == request.DriverId)
            {
                return ResponseFactory.Fail<ResponseRideDto>("Driver and Passenger can't be the same", 400);
            }
            if (ridePost == null || ridePost.Status == RidePostStatusEnum.Matched)
            {
                return ResponseFactory.Fail<ResponseRideDto>("Post doen't exists or it is matched", 404);
            }
            (double distanceKm, int durationMinutes) = await _ridePostService.CalculateKmDurationAsync(ridePost.StartLocation, ridePost.EndLocation);
            if (distanceKm == 0 && durationMinutes == 0)
            {
                return ResponseFactory.Fail<ResponseRideDto>("Ride post not found", 404);
            }
            await _unitOfWork.BeginTransactionAsync();
            try
            { 
                ridePost.Matched();
                var ride = new Ride(request.DriverId, userId, request.Fare, durationMinutes, request.RidePostId);
                await _unitOfWork.RideRepository.AddAsync(ride);

                await _unitOfWork.SaveChangesAsync();
                await _unitOfWork.CommitTransactionAsync();
                var rideDto = new ResponseRideDto
                {
                    Id = ride.Id,
                    DriverId = ride.DriverId,
                    PassengerId = userId,
                    RidePostId = ride.RidePostId,
                    StartTime = ride.StartTime.HasValue
                    ? FormatUtcToLocal(ride.StartTime.Value) : null,
                    CreatedAt = FormatUtcToLocal(ride.CreatedAt),
                    EndTime = ride.EndTime.HasValue ? FormatUtcToLocal(ride.EndTime.Value) : null,
                    EstimatedDuration = ride.EstimatedDuration,
                    Fare = ride.Fare ?? 0,
                    Status = ride.Status
                };
                return ResponseFactory.Success(rideDto, "Create Ride Success", 200);
            }
            catch (Exception e)
            {
                await _unitOfWork.RollbackTransactionAsync();
                return ResponseFactory.Fail<ResponseRideDto>(e.Message, 500);
            }
        }

    }
    
}
