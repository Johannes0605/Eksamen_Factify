using QuizApp.DAL;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();



builder.WebHost.UseUrls("https://localhost:5001"); // pick any free port

// Add CORS so React can talk to the API
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy => policy
            .AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod());
});

// Register your EF DbContext using SQLite
builder.Services.AddDbContext<QuizDbContext>(options =>
    options.UseSqlite("Data Source=quiz.db"));

// Register repositories if needed
builder.Services.AddScoped<IQuizRepository, QuizRepository>();

var app = builder.Build();



// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();



app.UseCors("AllowReactApp");

app.UseAuthorization();

app.MapControllers(); // Enable API controllers

// Seed the database with initial data
DBInit.Seed(app);

app.Run();
