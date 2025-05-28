using System.ComponentModel.DataAnnotations;

namespace Obralia.Core.Entities;

public class Service : BaseEntity
{
    [Required]
    public Guid UserId { get; set; }

    [Required]
    public string Title { get; set; } = null!;

    public string? Description { get; set; }

    public decimal Price { get; set; }

    public string? Currency { get; set; }

    public bool IsActive { get; set; }

    // Navigation properties
    public User User { get; set; } = null!;
    public List<ServiceCategory> Categories { get; set; } = new();
} 