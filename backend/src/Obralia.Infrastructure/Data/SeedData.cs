using Microsoft.EntityFrameworkCore;
using Obralia.Domain.Models;

namespace Obralia.Infrastructure.Data;

public static class SeedData
{
    public static async Task SeedAsync(ApplicationDbContext context)
    {
        // Usuarios admin y de prueba
        var adminEmail = "admin@obralia.com";
        if (!await context.Users.AnyAsync(u => u.Email == adminEmail))
        {
            var admin = new User
            {
                Id = Guid.NewGuid(),
                Name = "Admin",
                Email = adminEmail,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"),
                Role = UserRole.Admin,
                IsVerified = true,
                IsProfessional = false,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            await context.Users.AddAsync(admin);
        }

        // Categorías
        var categories = new List<Category>
        {
            new Category { Name = "Carpintería", Description = "Trabajos de madera y muebles", Icon = "🪚" },
            new Category { Name = "Albañilería", Description = "Obra, reformas y construcción", Icon = "🏗️" },
            new Category { Name = "Fontanería", Description = "Instalaciones y reparaciones de agua", Icon = "🚰" },
            new Category { Name = "Electricidad", Description = "Instalaciones eléctricas y reparaciones", Icon = "💡" },
            new Category { Name = "Pintura", Description = "Pintura de interiores y exteriores", Icon = "🎨" },
            new Category { Name = "Climatización", Description = "Aire acondicionado y calefacción", Icon = "❄️" },
            new Category { Name = "Jardinería", Description = "Cuidado de jardines y exteriores", Icon = "🌳" },
            new Category { Name = "Limpieza", Description = "Limpieza profesional de espacios", Icon = "🧹" },
            new Category { Name = "Reformas integrales", Description = "Reformas completas de viviendas", Icon = "" }
        };
        foreach (var cat in categories)
        {
            if (!await context.Categories.AnyAsync(c => c.Name == cat.Name))
            {
                cat.Id = Guid.NewGuid();
                await context.Categories.AddAsync(cat);
            }
        }

        // Profesionales y clientes de prueba
        for (int i = 1; i <= 8; i++)
        {
            var profEmail = $"profesional{i}@obralia.com";
            if (!await context.Users.AnyAsync(u => u.Email == profEmail))
            {
                var prof = new User
                {
                    Id = Guid.NewGuid(),
                    Name = $"Profesional {i}",
                    Email = profEmail,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword($"Prof{i}123!"),
                    Role = UserRole.Professional,
                    IsVerified = i % 2 == 0,
                    IsProfessional = true,
                    CreatedAt = DateTime.UtcNow.AddDays(-i * 10),
                    UpdatedAt = DateTime.UtcNow.AddDays(-i * 5)
                };
                await context.Users.AddAsync(prof);
                if (!await context.ProfessionalProfiles.AnyAsync(p => p.UserId == prof.Id))
                {
                    var profProfile = new ProfessionalProfile
                    {
                        Id = Guid.NewGuid(),
                        UserId = prof.Id,
                        User = prof,
                        Specialties = new List<string> { "Carpintería", "Albañilería", "Fontanería", "Electricidad".Substring(0, 5 + i % 4) },
                        Experience = 2 + i,
                        Description = $"Profesional {i} con experiencia en reformas y reparaciones.",
                        HourlyRate = 20 + i * 5,
                        CompletedProjects = 10 + i * 3,
                        ActiveProjects = i % 3
                    };
                    await context.ProfessionalProfiles.AddAsync(profProfile);
                }
            }
            var cliEmail = $"cliente{i}@obralia.com";
            if (!await context.Users.AnyAsync(u => u.Email == cliEmail))
            {
                var cli = new User
                {
                    Id = Guid.NewGuid(),
                    Name = $"Cliente {i}",
                    Email = cliEmail,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword($"Client{i}123!"),
                    Role = UserRole.Client,
                    IsVerified = i % 2 == 1,
                    IsProfessional = false,
                    CreatedAt = DateTime.UtcNow.AddDays(-i * 7),
                    UpdatedAt = DateTime.UtcNow.AddDays(-i * 3)
                };
                await context.Users.AddAsync(cli);
                if (!await context.ClientProfiles.AnyAsync(p => p.UserId == cli.Id))
                {
                    var cliProfile = new ClientProfile
                    {
                        Id = Guid.NewGuid(),
                        UserId = cli.Id,
                        User = cli,
                        ActiveProjects = i % 3,
                        CompletedProjects = i * 2,
                        TotalSpent = 500 * i + 200
                    };
                    await context.ClientProfiles.AddAsync(cliProfile);
                }
            }
        }

        await context.SaveChangesAsync();
    }
} 