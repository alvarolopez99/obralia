using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Obralia.Core.Entities;

public class ProfessionalAvailability
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    public Guid ProfessionalId { get; set; }

    [ForeignKey("ProfessionalId")]
    public ProfessionalProfile Professional { get; set; } = null!;

    [Required]
    public DayOfWeek DayOfWeek { get; set; }

    [Required]
    public TimeSpan StartTime { get; set; }

    [Required]
    public TimeSpan EndTime { get; set; }

    public bool IsAvailable { get; set; } = true;

    public string? Notes { get; set; }
} 