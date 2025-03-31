using Microsoft.EntityFrameworkCore;
using WaterProject.API.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins("http://localhost:3000","https://localhost:3000")
                .AllowCredentials()
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});

builder.Services.AddDbContext<WaterDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("WaterConnection")));

builder.Services.AddCors(options =>
    options.AddPolicy("AllowReactAppBlah",
    policy =>
    {
        policy.WithOrigins("http://localhost:3000", "https://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod();
    }));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowReactAppBlah");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
