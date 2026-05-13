using WatchedVideos.Application.DTOs;
using WatchedVideos.Application.Interfaces;
using WatchedVideos.Domain.Entities;

namespace WatchedVideos.Application.Services;

public class WatchedVideoService : IWatchedVideoService
{
    private readonly IWatchedVideoRepository _repository;

    public WatchedVideoService(IWatchedVideoRepository repository)
    {
        _repository = repository;
    }

    public async Task MarkAsWatchedAsync(string id, bool isWatched, string userId, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(id))
        {
            throw new ArgumentException("Video id is required.", nameof(id));
        }

        if (string.IsNullOrWhiteSpace(userId))
        {
            throw new ArgumentException("User id is required.", nameof(userId));
        }

        var existing = await _repository.GetByVideoAndUserAsync(id, userId, cancellationToken);

        if (existing is null)
        {
            var entity = new WatchedVideo
            {
                VideoId = id,
                UserId = userId,
                IsWatched = isWatched,
                UpdatedOn = DateTime.UtcNow
            };

            await _repository.AddAsync(entity, cancellationToken);
        }
        else
        {
            existing.IsWatched = isWatched;
            existing.UpdatedOn = DateTime.UtcNow;
            _repository.Update(existing);
        }

        await _repository.SaveChangesAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<WatchedVideoDto>> GetAllWatchedAsync(string userId, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(userId))
        {
            throw new ArgumentException("User id is required.", nameof(userId));
        }

        var videos = await _repository.GetWatchedByUserAsync(userId, cancellationToken);

        return videos
            .Select(v => new WatchedVideoDto
            {
                VideoId = v.VideoId,
                UserId = v.UserId,
                IsWatched = v.IsWatched,
                UpdatedOn = v.UpdatedOn
            })
            .ToList();
    }
}
