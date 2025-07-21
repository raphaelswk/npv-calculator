
using GTreasury.NPV.Services.Implementations;
using GTreasury.NPV.Services.Interfaces;

namespace GTreasury.NPV.Api
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();


            // Dependency Injection for our service
            builder.Services.AddScoped<INpvService, NpvService>();

            // Configure CORS to allow requests from the Next.js frontend
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowNextApp", policy =>
                {
                    policy.WithOrigins("http://localhost:3000") // The default Next.js dev server port
                          .AllowAnyHeader()
                          .AllowAnyMethod();
                });
            });

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseCors("AllowNextApp"); // Enable CORS

            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}
