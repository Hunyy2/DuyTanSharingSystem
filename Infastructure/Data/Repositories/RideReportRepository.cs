﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Data.Repositories
{
    public class RideReportRepository : BaseRepository<RideReport>, IRideReportRepository
    {
        public RideReportRepository(AppDbContext context) : base(context)
        {
        }

        public override Task<bool> DeleteAsync(Guid id)
        {
            throw new NotImplementedException();
        }

        public async Task<List<RideReport>> GetReportsByAlertTypesAsync(List<AlertTypeEnums> alertTypes)
        {
            return await _context.RideReports
               .Where(r => alertTypes.Contains(r.AlertType))
               .Include(r => r.Passenger)
               .Include(r => r.Ride)
                 .ThenInclude(ride => ride.Driver)
               .ToListAsync();
        }

        public Task<int> GetWarningCountAsync(Guid userId)
        {
            return _context.RideReports
                .CountAsync(w => w.RideId == userId);
        }
    }
}
