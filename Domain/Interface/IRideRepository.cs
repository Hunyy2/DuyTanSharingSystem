﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interface
{
    public interface IRideRepository : IBaseRepository<Ride>
    {
        Task<IEnumerable<Ride>> GetActiveRidesAsync();
        Task<Ride?> GetRideByUserIdAsync(Guid userId);
        Task<int> GetDriveRideCountAsync(Guid userId);
        Task<int> GetPassengerRideCountAsync(Guid userId);
        Task<List<Ride>> GetRidePostsByPassengerIdAsync(Guid passengerId, Guid? lastPostId, int pageSize);
        Task<List<RidePost>> GetRidePostsByDriverIdAsync(Guid driverId, Guid? lastPostId, int pageSize);
    }
}
