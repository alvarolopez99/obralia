using System.ComponentModel.DataAnnotations;

namespace Obralia.Core.Entities;

public class Category
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = null!;

    [MaxLength(500)]
    public string? Description { get; set; }

    public string? Icon { get; set; }

    // Navigation properties
    public ICollection<ProfessionalProfile> Professionals { get; set; } = new List<ProfessionalProfile>();
} 