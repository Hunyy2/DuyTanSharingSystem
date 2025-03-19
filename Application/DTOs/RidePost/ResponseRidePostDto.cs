﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Domain.Common.Enums;

namespace Application.DTOs.RidePost
{
    public class ResponseRidePostDto
    {
        public Guid Id { get;  set; }
        public Guid UserId { get;  set; }
        public required string StartLocation { get;  set; }
        public required string EndLocation { get;  set; }
        public string? StartTime { get;  set; }
        public PostRideTypeEnum PostType { get;  set; }
        public RidePostStatusEnum Status { get;  set; }
        public string? CreatedAt { get;  set; }
    }
}
