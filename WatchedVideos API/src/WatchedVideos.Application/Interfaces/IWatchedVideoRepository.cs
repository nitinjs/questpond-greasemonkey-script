using WatchedVideos.Domain.Entities;

namespace WatchedVideos.Application.Interfaces;

public interface IWatchedVideoRepository
{
    Task<WatchedVideo?> GetByVideoAndUserAsync(string videoId, string userId, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<WatchedVideo>> GetWatchedByUserAsync(string userId, CancellationToken cancellationToken = default);

    Task AddAsync(WatchedVideo entity, CancellationToken cancellationToken = default);

    void Update(WatchedVideo entity);

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
