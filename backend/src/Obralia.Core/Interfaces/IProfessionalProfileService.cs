using Obralia.Core.Entities;

namespace Obralia.Core.Interfaces;

public interface IProfessionalProfileService
{
    Task<ProfessionalProfile> CreateProfileAsync(Guid userId, string? bio, string? companyName, string? website);
    Task<ProfessionalProfile> UpdateProfileAsync(Guid id, string? bio, string? companyName, string? website);
    Task<ProfessionalProfile> UpdateLocationAsync(Guid id, string address, string city, string state, string country, string postalCode, double latitude, double longitude);
    Task<ProfessionalProfile> UpdateAvailabilityAsync(Guid id, bool isAvailable, decimal? hourlyRate);
    Task<ProfessionalProfile> AddCategoryAsync(Guid id, Guid categoryId);
    Task<ProfessionalProfile> RemoveCategoryAsync(Guid id, Guid categoryId);
    Task<ProfessionalProfile> AddSkillAsync(Guid id, Guid skillId, int yearsOfExperience);
    Task<ProfessionalProfile> RemoveSkillAsync(Guid id, Guid skillId);
    Task<ProfessionalProfile> AddAvailabilityAsync(Guid id, DayOfWeek dayOfWeek, TimeSpan startTime, TimeSpan endTime);
    Task<ProfessionalProfile> RemoveAvailabilityAsync(Guid id, Guid availabilityId);
} 