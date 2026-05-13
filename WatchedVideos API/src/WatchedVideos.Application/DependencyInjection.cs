using Microsoft.Extensions.DependencyInjection;
using WatchedVideos.Application.Interfaces;
using WatchedVideos.Application.Services;

namespace WatchedVideos.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<IWatchedVideoService, WatchedVideoService>();
        return services;
    }
}
