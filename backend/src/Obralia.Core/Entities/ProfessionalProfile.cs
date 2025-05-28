using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Obralia.Core.Entities;

public class ProfessionalProfile : BaseEntity
{
    [Required]
    public Guid UserId { get; set; }

    [ForeignKey("UserId")]
    public User User { get; set; } = null!;

    public string? Bio { get; set; }
    public string? CompanyName { get; set; }
    public string? Website { get; set; }
    public string? Address { get; set; }
    public string? City { get; set; }
    public string? State { get; set; }
    public string? Country { get; set; }
    public string? PostalCode { get; set; }
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
    public decimal? HourlyRate { get; set; }
    public bool IsAvailable { get; set; }
    public bool IsVerified { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    // Navigation properties
    public ICollection<Category> Categories { get; set; } = new List<Category>();
    public ICollection<ProfessionalAvailability> Availabilities { get; set; } = new List<ProfessionalAvailability>();
    public ICollection<ProfessionalBooking> Bookings { get; set; } = new List<ProfessionalBooking>();
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
} 