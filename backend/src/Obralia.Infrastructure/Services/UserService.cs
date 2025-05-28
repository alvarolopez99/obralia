using Microsoft.EntityFrameworkCore;
using Obralia.Core.DTOs;
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

    public async Task<User?> GetByIdAsync(Guid id)
    {
        return await _context.Users
            .Include(u => u.ProfessionalProfile)
            .FirstOrDefaultAsync(u => u.Id == id);
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        return await _context.Users
            .Include(u => u.ProfessionalProfile)
            .FirstOrDefaultAsync(u => u.Email == email);
    }

    public async Task<User?> LoginAsync(string email, string password)
    {
        var user = await _context.Users
            .Include(u => u.ProfessionalProfile)
            .FirstOrDefaultAsync(u => u.Email == email);

        if (user == null || !BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
        {
            return null;
        }

        return user;
    }

    public async Task<User> RegisterAsync(string email, string password, string name, string userType)
    {
        var user = new User
        {
            Email = email,
            Name = name,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
            UserType = userType,
            IsProfessional = userType == "professional"
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return user;
    }

    public async Task<User> RegisterWithGoogleAsync(string email, string googleId, string firstName, string lastName)
    {
        var user = new User
        {
            Email = email,
            Name = $"{firstName} {lastName}",
            GoogleId = googleId,
            UserType = "client",
            IsVerified = true
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

    public async Task<User?> GetByGoogleIdAsync(string googleId)
    {
        return await _context.Users
            .Include(u => u.ProfessionalProfile)
            .FirstOrDefaultAsync(u => u.GoogleId == googleId);
    }

    public async Task UpdateUserAsync(User user)
    {
        _context.Users.Update(user);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteUserAsync(Guid id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user != null)
        {
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<IEnumerable<User>> GetAllUsersAsync()
    {
        return await _context.Users
            .Include(u => u.ProfessionalProfile)
            .ToListAsync();
    }

    public async Task<IEnumerable<User>> GetProfessionalsAsync()
    {
        return await _context.Users
            .Include(u => u.ProfessionalProfile)
            .Where(u => u.IsProfessional)
            .ToListAsync();
    }

    public async Task<User> UpdateProfileAsync(Guid id, string firstName, string lastName, string? phoneNumber, string? profilePictureUrl)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
        {
            throw new InvalidOperationException("User not found");
        }

        user.Name = $"{firstName} {lastName}";
        user.PhoneNumber = phoneNumber;
        user.ProfilePictureUrl = profilePictureUrl;

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
        user.UserType = "professional";

        // Crear el perfil profesional
        var professionalProfile = new ProfessionalProfile
        {
            UserId = user.Id,
            Bio = "Perfil profesional recién creado",
            IsActive = true
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