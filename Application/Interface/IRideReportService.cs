﻿using Application.DTOs.Reposts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interface
{
    public interface IRideReportService
    {
        Task<List<RideReportDto>> GetFilteredReportsAsync();
    }
}
