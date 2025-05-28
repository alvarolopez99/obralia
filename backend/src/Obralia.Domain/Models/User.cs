using System;
using System.Collections.Generic;
using System.Text.Json;
using System.ComponentModel.DataAnnotations.Schema;

namespace Obralia.Domain.Models
{
    public enum UserRole
    {
        Client,
        Professional,
        Admin,
        ProfessionalAndClient
    }

    public class User
    {
        public Guid Id { get; set; }
        public required string Name { get; set; }
        public required string Email { get; set; }
        public required string PasswordHash { get; set; }
        public UserRole Role { get; set; }
        public string? PhoneNumber { get; set; }
        public string? ProfilePictureUrl { get; set; }
        public bool IsVerified { get; set; }
        public bool IsProfessional { get; set; }
        public ProfessionalProfile? ProfessionalProfile { get; set; }
        public ClientProfile? ClientProfile { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class ProfessionalProfile
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public required User User { get; set; }
        public required List<string> Specialties { get; set; }
        public int Experience { get; set; }
        public required string Description { get; set; }
        public decimal HourlyRate { get; set; }
        public Availability? Availability { get; set; }
        public Rating? Ratings { get; set; }
        public int CompletedProjects { get; set; }
        public int ActiveProjects { get; set; }
    }

    public class ClientProfile
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public required User User { get; set; }
        public int ActiveProjects { get; set; }
        public int CompletedProjects { get; set; }
        public decimal TotalSpent { get; set; }
    }

    public class Availability
    {
        public Guid Id { get; set; }
        public Guid ProfessionalProfileId { get; set; }
        public ProfessionalProfile? ProfessionalProfile { get; set; }
        public bool IsAvailable { get; set; }

        [NotMapped]
        public Dictionary<string, List<TimeSlot>> Schedule { get; set; } = new();

        public string ScheduleJson
        {
            get => JsonSerializer.Serialize(Schedule);
            set => Schedule = JsonSerializer.Deserialize<Dictionary<string, List<TimeSlot>>>(value) ?? new();
        }
    }

    public class TimeSlot
    {
        public Guid Id { get; set; }
        public TimeSpan Start { get; set; }
        public TimeSpan End { get; set; }
    }

    public class Rating
    {
        public Guid Id { get; set; }
        public Guid ProfessionalProfileId { get; set; }
        public ProfessionalProfile? ProfessionalProfile { get; set; }
        public double Average { get; set; }
        public int Count { get; set; }
    }
} 