﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.Post
{
    public class UserPostDto
    {
        public Guid UserId { get; set; }
        public string UserName { get; set; }
        public string? ProfilePicture { get; set; }

        public UserPostDto() { }
        public UserPostDto(Domain.Entities.User user)
        {
            UserId = user.Id;
            UserName = user.FullName ?? "Người dùng ẩn danh";
            ProfilePicture = user.ProfilePicture;
        }
    }
}
