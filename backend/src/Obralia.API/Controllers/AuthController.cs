using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Obralia.Core.DTOs;
using Obralia.Core.Entities;
using Obralia.Core.Interfaces;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;

namespace Obralia.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly IUserService _userService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(
        IConfiguration configuration,
        IUserService userService,
        ILogger<AuthController> logger)
    {
        _configuration = configuration;
        _userService = userService;
        _logger = logger;
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> GetCurrentUser()
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { message = "Usuario no autenticado" });
            }

            var user = await _userService.GetByIdAsync(Guid.Parse(userId));
            if (user == null)
            {
                return NotFound(new { message = "Usuario no encontrado" });
            }

            return Ok(new
            {
                id = user.Id,
                email = user.Email,
                name = user.Name,
                userType = user.UserType,
                isProfessional = user.IsProfessional,
                isVerified = user.IsVerified,
                profilePictureUrl = user.ProfilePictureUrl,
                phoneNumber = user.PhoneNumber
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener el usuario actual");
            return StatusCode(500, new { message = "Error interno del servidor" });
        }
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        try
        {
            var user = await _userService.LoginAsync(request.Email, request.Password);
            if (user == null)
            {
                return Unauthorized(new { message = "Credenciales inválidas" });
            }

            var token = GenerateJwtToken(user);
            SetAuthCookie(token);

            return Ok(new
            {
                user = new
                {
                    id = user.Id,
                    email = user.Email,
                    name = user.Name,
                    userType = user.UserType
                }
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error durante el login");
            return StatusCode(500, new { message = "Error interno del servidor" });
        }
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        try
        {
            if (!await _userService.IsEmailAvailableAsync(request.Email))
            {
                return BadRequest(new { message = "El email ya está registrado" });
            }

            var user = await _userService.RegisterAsync(
                request.Email,
                request.Password,
                request.Name,
                request.UserType
            );

            var token = GenerateJwtToken(user);
            SetAuthCookie(token);

            return Ok(new
            {
                user = new
                {
                    id = user.Id,
                    email = user.Email,
                    name = user.Name,
                    userType = user.UserType
                }
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error durante el registro");
            return StatusCode(500, new { message = "Error interno del servidor" });
        }
    }

    [HttpPost("logout")]
    public IActionResult Logout()
    {
        Response.Cookies.Delete("auth_token", new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Path = "/"
        });

        return Ok(new { message = "Logout exitoso" });
    }

    private string GenerateJwtToken(User user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key not found")));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Name, user.Name),
            new Claim("UserType", user.UserType)
        };

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddDays(7),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private void SetAuthCookie(string token)
    {
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Expires = DateTime.Now.AddDays(7),
            Path = "/"
        };

        Response.Cookies.Append("auth_token", token, cookieOptions);
    }
} 