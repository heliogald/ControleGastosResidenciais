using Microsoft.EntityFrameworkCore; 
using Financas.Api.Data;
var builder = WebApplication.CreateBuilder(args);

// 1. REGISTRO DE SERVIÇOS (O que o sistema usa)

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // Essencial para trabalhar com relacionamentos .Include() no EF Core
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
        
        // Opcional: não envia campos nulos no JSON, deixando o pacote menor
        options.JsonSerializerOptions.DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull;
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configuração do Banco de Dados (Mova para cá)
builder.Services.AddDbContext<Financas.Api.Data.AppDbContext>(options =>
    options.UseSqlite("Data Source=financas.db"));

builder.Services.AddCors(options => {
    options.AddPolicy("DefaultPolicy", policy => {
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
    });
});

var app = builder.Build();

// 2. CONFIGURAÇÃO DO PIPELINE (Como as requisições fluem)
if (app.Environment.IsDevelopment()) {
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("DefaultPolicy");
app.UseAuthorization();
app.MapControllers();

app.Run(); // Este deve ser sempre o último comando