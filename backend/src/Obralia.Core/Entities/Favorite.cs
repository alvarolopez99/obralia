using System.ComponentModel.DataAnnotations;

namespace Obralia.Core.Entities;

public class Favorite : BaseEntity
{
    [Required]
    public Guid UserId { get; set; }
    public User User { get; set; } = null!; // Quien marca como favorito

    [Required]
    public Guid ProfessionalId { get; set; }
    public User Professional { get; set; } = null!; // Quien es marcado como favorito
} 