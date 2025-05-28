using Obralia.Core.Entities;

namespace Obralia.Core.Interfaces;

public interface IUserRepository : IRepository<User>
{
    Task<User?> GetByEmailAsync(string email);
    Task<User?> GetByGoogleIdAsync(string googleId);
    Task<IEnumerable<User>> GetProfessionalsAsync();
    Task<IEnumerable<User>> GetProfessionalsByCategoryAsync(Guid categoryId);
    Task<IEnumerable<User>> GetProfessionalsBySkillAsync(Guid skillId);
    Task<IEnumerable<User>> GetProfessionalsByLocationAsync(string city, string? state = null, string? country = null);
} 