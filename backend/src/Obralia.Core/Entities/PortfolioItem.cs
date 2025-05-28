using System.ComponentModel.DataAnnotations;

namespace Obralia.Core.Entities;

public class PortfolioItem : BaseEntity
{
    [Required]
    public Guid UserId { get; set; }

    [Required]
    public string Title { get; set; } = null!;

    public string? Description { get; set; }

    public string? ImageUrl { get; set; }

    public string? ProjectUrl { get; set; }

    public DateTime? CompletionDate { get; set; }

    // Navigation properties
    public User User { get; set; } = null!;
} 