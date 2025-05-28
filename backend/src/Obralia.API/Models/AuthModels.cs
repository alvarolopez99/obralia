using System.ComponentModel.DataAnnotations;

namespace Obralia.API.Models;

public class LoginRequest
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = null!;

    [Required]
    public string Password { get; set; } = null!;
}

public class RegisterRequest
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = null!;

    [Required]
    [MinLength(6)]
    public string Password { get; set; } = null!;

    [Required]
    public string Name { get; set; } = null!;

    [Required]
    public string UserType { get; set; } = "client";
} 