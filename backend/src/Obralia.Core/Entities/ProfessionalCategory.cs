using System.ComponentModel.DataAnnotations;

namespace Obralia.Core.Entities;

public class ProfessionalCategory : BaseEntity
{
    [Required]
    public Guid ProfessionalProfileId { get; set; }

    [Required]
    public Guid CategoryId { get; set; }

    // Navigation properties
    public ProfessionalProfile ProfessionalProfile { get; set; } = null!;
    public Category Category { get; set; } = null!;
} 