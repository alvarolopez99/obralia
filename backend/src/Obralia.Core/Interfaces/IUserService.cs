using Obralia.Core.Entities;

namespace Obralia.Core.Interfaces;

public interface IUserService
{
    Task<User?> LoginAsync(string email, string password);
    Task<User> RegisterAsync(string email, string password, string firstName, string lastName);
    Task<User> RegisterWithGoogleAsync(string email, string googleId, string firstName, string lastName);
    Task<bool> IsEmailAvailableAsync(string email);
    Task<User?> GetByIdAsync(Guid id);
    Task<User?> GetByEmailAsync(string email);
    Task<User?> GetByGoogleIdAsync(string googleId);
    Task<User> UpdateProfileAsync(Guid id, string firstName, string lastName, string? phoneNumber, string? profilePictureUrl);
    Task<User> ConvertToProfessionalAsync(Guid id);
    Task<bool> IsGoogleIdAvailableAsync(string googleId);
} 