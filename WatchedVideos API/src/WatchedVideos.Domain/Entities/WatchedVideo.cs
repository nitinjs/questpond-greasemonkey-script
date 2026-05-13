namespace WatchedVideos.Domain.Entities;

public class WatchedVideo
{
    public int Id { get; set; }

    public string VideoId { get; set; } = string.Empty;

    public string UserId { get; set; } = string.Empty;

    public bool IsWatched { get; set; }

    public DateTime UpdatedOn { get; set; }
}
