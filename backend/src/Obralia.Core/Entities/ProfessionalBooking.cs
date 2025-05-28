using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Obralia.Core.Entities;

public class ProfessionalBooking
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    public Guid ProfessionalId { get; set; }

    [ForeignKey("ProfessionalId")]
    public ProfessionalProfile Professional { get; set; } = null!;

    [Required]
    public Guid ClientId { get; set; }

    [ForeignKey("ClientId")]
    public User Client { get; set; } = null!;

    [Required]
    public DateTime StartTime { get; set; }

    [Required]
    public DateTime EndTime { get; set; }

    [Required]
    public BookingStatus Status { get; set; } = BookingStatus.Pending;

    public string? Notes { get; set; }

    public string? Location { get; set; }

    public decimal? Price { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }
}

public enum BookingStatus
{
    Pending,
    Confirmed,
    Cancelled,
    Completed,
    NoShow
} 