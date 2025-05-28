using System.ComponentModel.DataAnnotations;

namespace Obralia.Core.Entities;

public class ProfessionalSkill : BaseEntity
{
    [Required]
    public Guid ProfessionalProfileId { get; set; }

    [Required]
    public Guid SkillId { get; set; }

    public int YearsOfExperience { get; set; }

    // Navigation properties
    public ProfessionalProfile ProfessionalProfile { get; set; } = null!;
    public Skill Skill { get; set; } = null!;
} 