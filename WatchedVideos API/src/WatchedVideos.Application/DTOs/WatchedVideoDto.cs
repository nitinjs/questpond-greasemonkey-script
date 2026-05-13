namespace WatchedVideos.Application.DTOs;

public class WatchedVideoDto
{
    public string VideoId { get; set; } = string.Empty;

    public string UserId { get; set; } = string.Empty;

    public bool IsWatched { get; set; }

    public DateTime UpdatedOn { get; set; }
}
