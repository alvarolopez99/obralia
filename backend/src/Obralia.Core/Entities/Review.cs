using System.ComponentModel.DataAnnotations;

namespace Obralia.Core.Entities;

public class Review : BaseEntity
{
    [Required]
    public Guid UserId { get; set; }
    public User User { get; set; } = null!; // Quien hace la review

    [Required]
    public Guid ProfessionalId { get; set; }
    public User Professional { get; set; } = null!; // Quien recibe la review

    [Required]
    [Range(1, 5)]
    public int Rating { get; set; }

    public string? Comment { get; set; }
} 