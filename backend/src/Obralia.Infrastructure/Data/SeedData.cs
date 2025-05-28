using Microsoft.EntityFrameworkCore;
using Obralia.Core.Entities;

namespace Obralia.Infrastructure.Data;

public static class SeedData
{
    public static async Task SeedAsync(ApplicationDbContext context)
    {
        // Seed Categories
        if (!await context.Categories.AnyAsync())
        {
            var categories = new List<Category>
            {
                new Category { Name = "Carpintería", Description = "Trabajos de carpintería y ebanistería" },
                new Category { Name = "Albañilería", Description = "Construcción y reformas" },
                new Category { Name = "Pintura", Description = "Pintura de interiores y exteriores" },
                new Category { Name = "Fontanería", Description = "Instalaciones y reparaciones de fontanería" },
                new Category { Name = "Electricidad", Description = "Instalaciones y reparaciones eléctricas" },
                new Category { Name = "Jardinería", Description = "Mantenimiento y diseño de jardines" },
                new Category { Name = "Mecánica", Description = "Reparación y mantenimiento de vehículos" },
                new Category { Name = "Limpieza", Description = "Servicios de limpieza profesional" },
                new Category { Name = "Herrería", Description = "Trabajos de metal y forja" },
                new Category { Name = "Cerrajería", Description = "Instalación y reparación de cerraduras" },
                new Category { Name = "Mantenimiento", Description = "Mantenimiento general de edificios" },
                new Category { Name = "Reformas", Description = "Reformas integrales" },
                new Category { Name = "Decoración", Description = "Decoración de interiores" },
                new Category { Name = "Aislamiento", Description = "Aislamiento térmico y acústico" },
                new Category { Name = "Climatización", Description = "Instalación y mantenimiento de sistemas de climatización" }
            };

            await context.Categories.AddRangeAsync(categories);
            await context.SaveChangesAsync();
        }

        // Seed Users
        if (!await context.Users.AnyAsync())
        {
            var users = new List<User>
            {
                new User
                {
                    Email = "test@example.com",
                    FirstName = "Test",
                    LastName = "User",
                    IsProfessional = true
                }
            };

            await context.Users.AddRangeAsync(users);
            await context.SaveChangesAsync();
        }

        // Seed Professional Profiles
        if (!await context.ProfessionalProfiles.AnyAsync())
        {
            var testUser = await context.Users.FirstOrDefaultAsync(u => u.Email == "test@example.com");
            var category = await context.Categories.FirstOrDefaultAsync();
            if (testUser != null && category != null)
            {
                var profile = new ProfessionalProfile
                {
                    UserId = testUser.Id,
                    Bio = "Servicios de carpintería y ebanistería de alta calidad",
                    IsVerified = true,
                    IsActive = true,
                    Categories = new List<Category> { category }
                };
                await context.ProfessionalProfiles.AddAsync(profile);
                await context.SaveChangesAsync();
            }
        }

        // Seed Professional Availabilities
        if (!await context.ProfessionalAvailabilities.AnyAsync())
        {
            var testProfile = await context.ProfessionalProfiles.FirstOrDefaultAsync();
            if (testProfile != null)
            {
                var availabilities = new List<ProfessionalAvailability>
                {
                    new ProfessionalAvailability
                    {
                        ProfessionalId = testProfile.Id,
                        DayOfWeek = DayOfWeek.Monday,
                        StartTime = new TimeSpan(9, 0, 0),
                        EndTime = new TimeSpan(18, 0, 0),
                        IsAvailable = true
                    },
                    new ProfessionalAvailability
                    {
                        ProfessionalId = testProfile.Id,
                        DayOfWeek = DayOfWeek.Tuesday,
                        StartTime = new TimeSpan(9, 0, 0),
                        EndTime = new TimeSpan(18, 0, 0),
                        IsAvailable = true
                    }
                };
                await context.ProfessionalAvailabilities.AddRangeAsync(availabilities);
                await context.SaveChangesAsync();
            }
        }
    }
} 