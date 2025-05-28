using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Obralia.Infrastructure.Services;
using Obralia.Infrastructure.Data;
using System.Net;
using System.Net.Sockets;
using System.Diagnostics;

var builder = WebApplication.CreateBuilder(args);

// Verificar si el puerto 5001 está disponible
bool IsPortAvailable(int port)
{
    try
    {
        using var socket = new Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp);
        socket.Bind(new IPEndPoint(IPAddress.Loopback, port));
        socket.Close();
        return true;
    }
    catch
    {
        return false;
    }
}

// Verificar y liberar el puerto si es necesario
if (!IsPortAvailable(5001))
{
    Console.WriteLine("El puerto 5001 está ocupado. Intentando liberarlo...");
    try
    {
        // En macOS, usamos 'lsof' y 'kill' directamente
        var lsofProcess = new Process
        {
            StartInfo = new ProcessStartInfo
            {
                FileName = "lsof",
                Arguments = "-i :5001 -t",
                UseShellExecute = false,
                RedirectStandardOutput = true,
                CreateNoWindow = true
            }
        };
        lsofProcess.Start();
        string pid = lsofProcess.StandardOutput.ReadToEnd().Trim();
        lsofProcess.WaitForExit();

        if (!string.IsNullOrEmpty(pid))
        {
            var killProcess = new Process
            {
                StartInfo = new ProcessStartInfo
                {
                    FileName = "kill",
                    Arguments = $"-9 {pid}",
                    UseShellExecute = false,
                    CreateNoWindow = true
                }
            };
            killProcess.Start();
            killProcess.WaitForExit();
            
            // Esperar un momento para asegurarnos de que el puerto se libera
            Thread.Sleep(1000);
            
            if (!IsPortAvailable(5001))
            {
                throw new Exception("No se pudo liberar el puerto 5001. Por favor, cierre manualmente la aplicación que lo está usando.");
            }
        }
    }
    catch (Exception ex)
    {
        throw new Exception($"Error al intentar liberar el puerto 5001: {ex.Message}");
    }
}

// Configure Kestrel to use port 5001
builder.WebHost.ConfigureKestrel(serverOptions =>
{
    serverOptions.ListenLocalhost(5001);
});

// Add services to the container.
builder.Services.AddControllers();

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(builder.Configuration["FrontendUrl"] ?? "http://localhost:3000")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

// Configure DbContext
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Register services
builder.Services.AddScoped<IUserService, UserService>();

// Configure Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key not found"))
        )
    };

    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            // Leer el token de la cookie
            context.Token = context.Request.Cookies["auth_token"];
            return Task.CompletedTask;
        }
    };
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Use CORS
app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Seed the database
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<ApplicationDbContext>();
        context.Database.Migrate();
        await SeedData.SeedAsync(context);
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while seeding the database.");
    }
}

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
