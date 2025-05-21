using Application.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DuyTanSharingSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Policy = "Admin")]
    public class AdminDashboardController : ControllerBase
    {
        private readonly IDashboardAdminService _adminDashboardService;
        public AdminDashboardController(IDashboardAdminService adminDashboardService)
        {
            _adminDashboardService = adminDashboardService;
        }
        [HttpGet("overview")]
        public async Task<IActionResult> GetOverview()
        {
            var result = await _adminDashboardService.GetOverviewAsync();
            return Ok(result);
        }
        [HttpGet("user-stats")]
        public async Task<IActionResult> GetUserStats()
        {
            var result = await _adminDashboardService.GetUserStatsAsync();
            return Ok(result);
        }
        [HttpGet("report-stats")]
        public async Task<IActionResult> GetReportStats()
        {
            var result = await _adminDashboardService.GetReportStatsAsync();
            return Ok(result);
        }
        [HttpGet("user-trend")]
        public async Task<IActionResult> GetUserTrend([FromQuery] string timeRange = "month")
        {
            var result = await _adminDashboardService.GetUserTrendAsync(timeRange);
            return Ok(result);
        }

        [HttpGet("interaction-activity")]
        public async Task<IActionResult> GetInteractionActivity([FromQuery] string timeRange = "month")
        {
            var result = await _adminDashboardService.GetInteractionActivityAsync(timeRange);
            return Ok(result);
        }

        [HttpGet("user-stats-score")]
        public async Task<IActionResult> GetUserTrustDistribution()
        {
            var result = await _adminDashboardService.GetUserTrustDistributionAsync();
            return Ok(result);
        }
    }
}
