using System.ComponentModel.DataAnnotations;

namespace Obralia.API.Models;

public class User
{
    public Guid Id { get; set; }

    [Required]
    [EmailAddress]
    public string Email { get; set; } = null!;

    [Required]
    public string Name { get; set; } = null!;

    [Required]
    public string PasswordHash { get; set; } = null!;

    [Required]
    public string UserType { get; set; } = "client"; // "client" o "professional"

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
} 