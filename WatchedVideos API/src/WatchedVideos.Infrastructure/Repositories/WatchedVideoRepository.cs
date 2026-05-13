using Microsoft.EntityFrameworkCore;
using WatchedVideos.Application.Interfaces;
using WatchedVideos.Domain.Entities;
using WatchedVideos.Infrastructure.Persistence;

namespace WatchedVideos.Infrastructure.Repositories;

public class WatchedVideoRepository : IWatchedVideoRepository
{
    private readonly AppDbContext _context;

    public WatchedVideoRepository(AppDbContext context)
    {
        _context = context;
    }

    public Task<WatchedVideo?> GetByVideoAndUserAsync(string videoId, string userId, CancellationToken cancellationToken = default)
    {
        return _context.WatchedVideos
            .FirstOrDefaultAsync(x => x.VideoId == videoId && x.UserId == userId, cancellationToken);
    }

    public async Task<IReadOnlyList<WatchedVideo>> GetWatchedByUserAsync(string userId, CancellationToken cancellationToken = default)
    {
        return await _context.WatchedVideos
            .AsNoTracking()
            .Where(x => x.UserId == userId && x.IsWatched)
            .OrderByDescending(x => x.UpdatedOn)
            .ToListAsync(cancellationToken);
    }

    public async Task AddAsync(WatchedVideo entity, CancellationToken cancellationToken = default)
    {
        await _context.WatchedVideos.AddAsync(entity, cancellationToken);
    }

    public void Update(WatchedVideo entity)
    {
        _context.WatchedVideos.Update(entity);
    }

    public Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return _context.SaveChangesAsync(cancellationToken);
    }
}
