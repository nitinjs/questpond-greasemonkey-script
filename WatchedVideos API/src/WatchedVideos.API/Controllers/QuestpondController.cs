using Microsoft.AspNetCore.Mvc;
using WatchedVideos.Application.DTOs;
using WatchedVideos.Application.Interfaces;

namespace WatchedVideos.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class QuestpondController : ControllerBase
{
    private readonly IWatchedVideoService _watchedVideoService;

    public QuestpondController(IWatchedVideoService watchedVideoService)
    {
        _watchedVideoService = watchedVideoService;
    }

    [HttpPost("MarkAsWatched")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> MarkAsWatched([FromQuery] string id, [FromQuery] bool isWatched, [FromQuery] string userId, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(id) || string.IsNullOrWhiteSpace(userId))
        {
            return BadRequest("id and userId are required.");
        }

        await _watchedVideoService.MarkAsWatchedAsync(id, isWatched, userId, cancellationToken);
        return NoContent();
    }

    [HttpGet("GetAllWatched")]
    [ProducesResponseType(typeof(IReadOnlyList<WatchedVideoDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<IReadOnlyList<WatchedVideoDto>>> GetAllWatched([FromQuery] string userId, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(userId))
        {
            return BadRequest("userId is required.");
        }

        var result = await _watchedVideoService.GetAllWatchedAsync(userId, cancellationToken);
        return Ok(result);
    }
}
