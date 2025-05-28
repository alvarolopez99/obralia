using System.ComponentModel.DataAnnotations;

namespace Obralia.Core.Entities;

public class ServiceCategory : BaseEntity
{
    [Required]
    public Guid ServiceId { get; set; }

    [Required]
    public Guid CategoryId { get; set; }

    // Navigation properties
    public Service Service { get; set; } = null!;
    public Category Category { get; set; } = null!;
} 