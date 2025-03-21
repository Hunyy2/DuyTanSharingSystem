﻿using Application.CQRS.Commands.Shares;
using Application.CQRS.Queries.Likes;
using Application.CQRS.Queries.Shares;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DuyTanSharingSystem.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ShareController : ControllerBase
    {
        private readonly IMediator _mediator;
        public ShareController(IMediator mediator)
        {
            _mediator = mediator;
        }
        [HttpPost("SharePost")]
        public async Task<IActionResult> SharePost([FromBody] SharePostCommand command)
        {
            var response = await _mediator.Send(command);
            return Ok(response);
        }
        [HttpGet("get-shares/{postId}")]
        public async Task<IActionResult> GetShares(Guid postId, [FromQuery] int page = 1, [FromQuery] int pageSize = 2)
        {
            var query = new GetSharesByPostIdQuery(postId, page,  pageSize );
            var result = await _mediator.Send(query);
            return Ok(result);
        }
    }
}
