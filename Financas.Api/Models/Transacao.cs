using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Financas.Api.Models
{
    public enum TipoTransacao { Despesa = 1, Receita = 2 }

    public class Transacao
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public string Descricao { get; set; } = string.Empty;

        [JsonIgnore] // Isso impede o erro de "field is required" no POST
        public Categoria? Categoria { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        [Range(0.01, double.MaxValue, ErrorMessage = "O valor deve ser positivo")]
        public decimal Valor { get; set; }

        public TipoTransacao Tipo { get; set; }

        // Relacionamentos
        [Required]
        public Guid CategoriaId { get; set; }

        [JsonIgnore] // Isso evita que o JSON tente validar o objeto Pessoa inteiro
        public Pessoa? Pessoa { get; set; }       

        [Required]
        public Guid PessoaId { get; set; }
        

        
    }
}