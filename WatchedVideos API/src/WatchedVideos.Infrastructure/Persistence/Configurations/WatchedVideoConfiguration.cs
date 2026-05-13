using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WatchedVideos.Domain.Entities;

namespace WatchedVideos.Infrastructure.Persistence.Configurations;

public class WatchedVideoConfiguration : IEntityTypeConfiguration<WatchedVideo>
{
    public void Configure(EntityTypeBuilder<WatchedVideo> builder)
    {
        builder.ToTable("WatchedVideos");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.VideoId)
            .IsRequired()
            .HasMaxLength(128);

        builder.Property(x => x.UserId)
            .IsRequired()
            .HasMaxLength(128);

        builder.Property(x => x.IsWatched)
            .IsRequired();

        builder.Property(x => x.UpdatedOn)
            .IsRequired();

        builder.HasIndex(x => new { x.UserId, x.VideoId })
            .IsUnique();
    }
}
