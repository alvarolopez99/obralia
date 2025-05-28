using System.ComponentModel.DataAnnotations;

namespace Obralia.Core.Entities;

public class User : BaseEntity
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = null!;

    public string? PasswordHash { get; set; }

    [Required]
    public string FirstName { get; set; } = null!;

    [Required]
    public string LastName { get; set; } = null!;

    public string? PhoneNumber { get; set; }

    public string? ProfilePictureUrl { get; set; }

    public bool IsProfessional { get; set; }

    public bool IsVerified { get; set; }

    public string? GoogleId { get; set; }

    // Navigation properties
    public ProfessionalProfile? ProfessionalProfile { get; set; }
    public List<Favorite> Favorites { get; set; } = new(); // Favoritos que este usuario ha marcado
    public List<Favorite> FavoritedBy { get; set; } = new(); // Usuarios que han marcado a este usuario como favorito
    public List<Review> Reviews { get; set; } = new(); // Reviews que este usuario ha hecho
    public List<Review> ReceivedReviews { get; set; } = new(); // Reviews que este usuario ha recibido como profesional
    public List<Service> Services { get; set; } = new();
    public List<PortfolioItem> PortfolioItems { get; set; } = new();
} 