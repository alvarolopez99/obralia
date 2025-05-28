using Microsoft.EntityFrameworkCore;
using Obralia.Core.Entities;
using Obralia.Core.Interfaces;
using Obralia.Infrastructure.Data;
using System.Security.Cryptography;
using System.Text;

namespace Obralia.Infrastructure.Services;

public class UserService : IUserService
{
    private readonly ApplicationDbContext _context;

    public UserService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<User?> LoginAsync(string email, string password)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == email);

        if (user == null || user.GoogleId != null)
        {
            return null;
        }

        var hashedPassword = HashPassword(password);
        if (user.PasswordHash != hashedPassword)
        {
            return null;
        }

        return user;
    }

    public async Task<User> RegisterAsync(string email, string password, string firstName, string lastName)
    {
        if (!await IsEmailAvailableAsync(email))
        {
            throw new InvalidOperationException("Email is already registered");
        }

        var user = new User
        {
            Email = email,
            PasswordHash = HashPassword(password),
            FirstName = firstName,
            LastName = lastName,
            CreatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return user;
    }

    public async Task<User> RegisterWithGoogleAsync(string email, string googleId, string firstName, string lastName)
    {
        if (!await IsEmailAvailableAsync(email))
        {
            throw new InvalidOperationException("Email is already registered");
        }

        if (!await IsGoogleIdAvailableAsync(googleId))
        {
            throw new InvalidOperationException("Google ID is already registered");
        }

        var user = new User
        {
            Email = email,
            GoogleId = googleId,
            FirstName = firstName,
            LastName = lastName,
            CreatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return user;
    }

    public async Task<bool> IsEmailAvailableAsync(string email)
    {
        return !await _context.Users.AnyAsync(u => u.Email == email);
    }

    public async Task<bool> IsGoogleIdAvailableAsync(string googleId)
    {
        return !await _context.Users.AnyAsync(u => u.GoogleId == googleId);
    }

    public async Task<User?> GetByIdAsync(Guid id)
    {
        return await _context.Users.FindAsync(id);
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
    }

    public async Task<User?> GetByGoogleIdAsync(string googleId)
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.GoogleId == googleId);
    }

    public async Task<User> UpdateProfileAsync(Guid id, string firstName, string lastName, string? phoneNumber, string? profilePictureUrl)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
        {
            throw new InvalidOperationException("User not found");
        }

        user.FirstName = firstName;
        user.LastName = lastName;
        user.PhoneNumber = phoneNumber;
        user.ProfilePictureUrl = profilePictureUrl;
        user.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return user;
    }

    public async Task<User> ConvertToProfessionalAsync(Guid id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
        {
            throw new InvalidOperationException("User not found");
        }

        if (user.IsProfessional)
        {
            throw new InvalidOperationException("User is already a professional");
        }

        user.IsProfessional = true;
        user.UpdatedAt = DateTime.UtcNow;

        // Crear el perfil profesional
        var professionalProfile = new ProfessionalProfile
        {
            UserId = user.Id,
            CreatedAt = DateTime.UtcNow
        };

        _context.ProfessionalProfiles.Add(professionalProfile);
        await _context.SaveChangesAsync();

        return user;
    }

    private string HashPassword(string password)
    {
        using var sha256 = SHA256.Create();
        var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
        return Convert.ToBase64String(hashedBytes);
    }
} 