using WatchedVideos.Application.DTOs;

namespace WatchedVideos.Application.Interfaces;

public interface IWatchedVideoService
{
    Task MarkAsWatchedAsync(string id, bool isWatched, string userId, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<WatchedVideoDto>> GetAllWatchedAsync(string userId, CancellationToken cancellationToken = default);
}
