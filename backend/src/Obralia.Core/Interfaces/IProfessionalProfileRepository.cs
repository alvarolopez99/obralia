using Obralia.Core.Entities;

namespace Obralia.Core.Interfaces;

public interface IProfessionalProfileRepository : IRepository<ProfessionalProfile>
{
    Task<ProfessionalProfile?> GetByUserIdAsync(Guid userId);
    Task<IEnumerable<ProfessionalProfile>> GetAvailableProfilesAsync();
    Task<IEnumerable<ProfessionalProfile>> GetProfilesByCategoryAsync(Guid categoryId);
    Task<IEnumerable<ProfessionalProfile>> GetProfilesBySkillAsync(Guid skillId);
    Task<IEnumerable<ProfessionalProfile>> GetProfilesByLocationAsync(string city, string? state = null, string? country = null);
    Task<IEnumerable<ProfessionalProfile>> GetProfilesByAvailabilityAsync(DayOfWeek dayOfWeek, TimeSpan startTime, TimeSpan endTime);
} 