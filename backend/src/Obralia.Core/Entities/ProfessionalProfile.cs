using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Obralia.Core.Entities;

public class ProfessionalProfile : BaseEntity
{
    [Required]
    public Guid UserId { get; set; }

    [ForeignKey("UserId")]
    public User User { get; set; } = null!;

    [Required]
    public string Bio { get; set; } = null!;

    public bool IsVerified { get; set; }

    public bool IsActive { get; set; }

    public string? ProfilePictureUrl { get; set; }

    public string? CoverImageUrl { get; set; }

    public string? WebsiteUrl { get; set; }

    public string? FacebookUrl { get; set; }

    public string? InstagramUrl { get; set; }

    public string? TwitterUrl { get; set; }

    public string? LinkedInUrl { get; set; }

    public string? YouTubeUrl { get; set; }

    public string? TikTokUrl { get; set; }

    public string? Address { get; set; }

    public string? City { get; set; }

    public string? State { get; set; }

    public string? Country { get; set; }

    public string? PostalCode { get; set; }

    public double? Latitude { get; set; }

    public double? Longitude { get; set; }

    public decimal? HourlyRate { get; set; }

    public bool IsAvailable { get; set; }

    // Navigation properties
    public List<Category> Categories { get; set; } = new();
    public List<ProfessionalAvailability> Availabilities { get; set; } = new();
    public List<ProfessionalBooking> Bookings { get; set; } = new();
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
} 