using Microsoft.EntityFrameworkCore;
using Obralia.Domain.Models;

namespace Obralia.Infrastructure.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; } = null!;
    public DbSet<ProfessionalProfile> ProfessionalProfiles { get; set; } = null!;
    public DbSet<ClientProfile> ClientProfiles { get; set; } = null!;
    public DbSet<Availability> Availabilities { get; set; } = null!;
    public DbSet<Rating> Ratings { get; set; } = null!;
    public DbSet<Category> Categories { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Email).IsRequired();
            entity.Property(e => e.Name).IsRequired();
            entity.Property(e => e.PasswordHash).IsRequired();
            entity.Property(e => e.Role).IsRequired();
            entity.HasIndex(e => e.Email).IsUnique();
        });

        modelBuilder.Entity<ProfessionalProfile>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.User)
                .WithOne(u => u.ProfessionalProfile)
                .HasForeignKey<ProfessionalProfile>(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<ClientProfile>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.User)
                .WithOne(u => u.ClientProfile)
                .HasForeignKey<ClientProfile>(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Availability>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.ProfessionalProfile)
                .WithOne(p => p.Availability)
                .HasForeignKey<Availability>(e => e.ProfessionalProfileId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Rating>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.ProfessionalProfile)
                .WithOne(p => p.Ratings)
                .HasForeignKey<Rating>(e => e.ProfessionalProfileId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
} 