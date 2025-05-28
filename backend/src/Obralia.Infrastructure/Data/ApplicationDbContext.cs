using Microsoft.EntityFrameworkCore;
using Obralia.Core.Entities;

namespace Obralia.Infrastructure.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; } = null!;
    public DbSet<ProfessionalProfile> ProfessionalProfiles { get; set; } = null!;
    public DbSet<Category> Categories { get; set; } = null!;
    public DbSet<ProfessionalAvailability> ProfessionalAvailabilities { get; set; } = null!;
    public DbSet<ProfessionalBooking> ProfessionalBookings { get; set; } = null!;
    public DbSet<Review> Reviews { get; set; } = null!;
    public DbSet<Favorite> Favorites { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Favorite: relación User (como usuario) y User (como profesional)
        modelBuilder.Entity<Favorite>()
            .HasOne(f => f.User)
            .WithMany(u => u.Favorites)
            .HasForeignKey(f => f.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Favorite>()
            .HasOne(f => f.Professional)
            .WithMany(u => u.FavoritedBy)
            .HasForeignKey(f => f.ProfessionalId)
            .OnDelete(DeleteBehavior.Restrict);

        // Review: relación User (como usuario) y User (como profesional)
        modelBuilder.Entity<Review>()
            .HasOne(r => r.User)
            .WithMany(u => u.Reviews)
            .HasForeignKey(r => r.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Review>()
            .HasOne(r => r.Professional)
            .WithMany(u => u.ReceivedReviews)
            .HasForeignKey(r => r.ProfessionalId)
            .OnDelete(DeleteBehavior.Restrict);

        // Relación muchos a muchos entre ProfessionalProfile y Category
        modelBuilder.Entity<ProfessionalProfile>()
            .HasMany(p => p.Categories)
            .WithMany(c => c.Professionals);
    }
} 