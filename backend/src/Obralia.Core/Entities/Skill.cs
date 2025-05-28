using System.ComponentModel.DataAnnotations;

namespace Obralia.Core.Entities;

public class Skill : BaseEntity
{
    [Required]
    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    // Navigation properties
    public List<ProfessionalSkill> ProfessionalSkills { get; set; } = new();
} 