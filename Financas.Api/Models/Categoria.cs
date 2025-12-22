using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
namespace Financas.Api.Models
{
    public enum FinalidadeCategoria 
    { 
        Despesa = 1, 
        Receita = 2, 
        Ambas = 3 
    }

    public class Categoria
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public string Descricao { get; set; } = string.Empty;

        [JsonIgnore]
        public ICollection<Transacao> Transacoes { get; set; } = new List<Transacao>();

        public FinalidadeCategoria Finalidade { get; set; }
               
    }
}