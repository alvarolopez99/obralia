using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Obralia.Core.DTOs;
using Obralia.Core.Entities;
using Obralia.Core.Interfaces;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Obralia.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly IConfiguration _configuration;

    public AuthController(IUserService userService, IConfiguration configuration)
    {
        _userService = userService;
        _configuration = configuration;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var user = await _userService.LoginAsync(request.Email, request.Password);
        if (user == null)
        {
            return Unauthorized(new { message = "Invalid email or password" });
        }

        var token = GenerateJwtToken(user);
        return Ok(new { token, user });
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        if (!await _userService.IsEmailAvailableAsync(request.Email))
        {
            return BadRequest(new { message = "Email is already registered" });
        }

        var user = await _userService.RegisterAsync(
            request.Email,
            request.Password,
            request.FirstName,
            request.LastName
        );

        var token = GenerateJwtToken(user);
        return Ok(new { token, user });
    }

    [HttpPost("google")]
    public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginRequest request)
    {
        var user = await _userService.RegisterWithGoogleAsync(
            request.Email,
            request.GoogleId,
            request.FirstName,
            request.LastName
        );

        var token = GenerateJwtToken(user);
        return Ok(new { token, user });
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> GetCurrentUser()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
        {
            return Unauthorized();
        }

        var user = await _userService.GetByIdAsync(Guid.Parse(userId));
        if (user == null)
        {
            return NotFound();
        }

        return Ok(user);
    }

    private string GenerateJwtToken(User user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.GivenName, user.FirstName),
            new Claim(ClaimTypes.Surname, user.LastName),
            new Claim("IsProfessional", user.IsProfessional.ToString())
        };

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddDays(Convert.ToDouble(_configuration["Jwt:ExpiryInDays"])),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
} 