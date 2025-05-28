using System.ComponentModel.DataAnnotations;

namespace Obralia.Core.DTOs;

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

public class GoogleLoginRequest
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = null!;

    [Required]
    public string GoogleId { get; set; } = null!;

    [Required]
    public string FirstName { get; set; } = null!;

    [Required]
    public string LastName { get; set; } = null!;
} 