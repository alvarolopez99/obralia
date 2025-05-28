using Microsoft.EntityFrameworkCore;
using Obralia.Domain.Models;
using Obralia.Infrastructure.Data;

namespace Obralia.Infrastructure.Services;

public interface IUserService
{
    Task<User> CreateUserAsync(User user);
    Task<User?> GetUserByIdAsync(Guid id);
    Task<User?> GetUserByEmailAsync(string email);
    Task<IEnumerable<User>> GetAllUsersAsync();
    Task<IEnumerable<User>> GetProfessionalsAsync();
    Task<User> UpdateUserAsync(User user);
    Task DeleteUserAsync(Guid id);
    Task<User> CreateProfessionalProfileAsync(User user, ProfessionalProfile profile);
    Task<User?> LoginAsync(string email, string password);
    Task<User> RegisterAsync(string email, string password, string name, UserRole role);
    Task<bool> IsEmailAvailableAsync(string email);
    Task<User> UpdateProfileAsync(Guid id, string name, string? phoneNumber, string? profilePictureUrl);
    Task<User> ConvertToProfessionalAsync(Guid id);
}

public class UserService : IUserService
{
    private readonly ApplicationDbContext _context;

    public UserService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<User> CreateUserAsync(User user)
    {
        user.CreatedAt = DateTime.UtcNow;
        user.UpdatedAt = DateTime.UtcNow;
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return user;
    }

    public async Task<User?> GetUserByIdAsync(Guid id)
    {
        return await _context.Users
            .Include(u => u.ProfessionalProfile)
            .Include(u => u.ClientProfile)
            .FirstOrDefaultAsync(u => u.Id == id);
    }

    public async Task<User?> GetUserByEmailAsync(string email)
    {
        return await _context.Users
            .Include(u => u.ProfessionalProfile)
            .Include(u => u.ClientProfile)
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

    public async Task<User> RegisterAsync(string email, string password, string name, UserRole role)
    {
        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = email,
            Name = name,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
            Role = role,
            IsProfessional = role == UserRole.Professional,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return user;
    }

    public async Task<bool> IsEmailAvailableAsync(string email)
    {
        return !await _context.Users.AnyAsync(u => u.Email == email);
    }

    public async Task<User> UpdateUserAsync(User user)
    {
        user.UpdatedAt = DateTime.UtcNow;
        _context.Users.Update(user);
        await _context.SaveChangesAsync();
        return user;
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
            .Include(u => u.ClientProfile)
            .ToListAsync();
    }

    public async Task<IEnumerable<User>> GetProfessionalsAsync()
    {
        return await _context.Users
            .Include(u => u.ProfessionalProfile)
            .Where(u => u.IsProfessional)
            .ToListAsync();
    }

    public async Task<User> UpdateProfileAsync(Guid id, string name, string? phoneNumber, string? profilePictureUrl)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
        {
            throw new InvalidOperationException("User not found");
        }

        user.Name = name;
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
        user.Role = UserRole.Professional;
        user.UpdatedAt = DateTime.UtcNow;

        // Crear el perfil profesional
        var professionalProfile = new ProfessionalProfile
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            User = user,
            Specialties = new List<string>(),
            Experience = 0,
            Description = "Perfil profesional recién creado",
            HourlyRate = 0,
            Availability = new Availability
            {
                Id = Guid.NewGuid(),
                ProfessionalProfileId = user.Id,
                ProfessionalProfile = user.ProfessionalProfile,
                IsAvailable = true,
                Schedule = new Dictionary<string, List<TimeSlot>>()
            },
            Ratings = new Rating
            {
                Id = Guid.NewGuid(),
                ProfessionalProfileId = user.Id,
                ProfessionalProfile = user.ProfessionalProfile,
                Average = 0,
                Count = 0
            },
            CompletedProjects = 0,
            ActiveProjects = 0
        };

        user.ProfessionalProfile = professionalProfile;
        await _context.SaveChangesAsync();

        return user;
    }

    public async Task<User> CreateProfessionalProfileAsync(User user, ProfessionalProfile profile)
    {
        user.IsProfessional = true;
        user.Role = UserRole.Professional;
        user.ProfessionalProfile = profile;
        user.UpdatedAt = DateTime.UtcNow;

        _context.Users.Update(user);
        await _context.SaveChangesAsync();
        return user;
    }
} 