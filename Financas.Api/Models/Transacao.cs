using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Financas.Api.Models
{
    public enum TipoTransacao { Despesa = 1, Receita = 2 }

    public class Transacao
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required(ErrorMessage = "A descrição é obrigatória")]
        public string Descricao { get; set; } = string.Empty;

        [Column(TypeName = "decimal(18,2)")]
        [Range(0.01, double.MaxValue, ErrorMessage = "O valor deve ser positivo")]
        public decimal Valor { get; set; }

        public TipoTransacao Tipo { get; set; }

        // --- Categoria ---
        [Required]
        public Guid CategoriaId { get; set; }

        // Sem JsonIgnore para que o Front-end receba os dados da categoria
        public virtual Categoria? Categoria { get; set; }

        // --- Pessoa ---
        [Required]
        public Guid PessoaId { get; set; }

        // Sem JsonIgnore para que o Front-end receba os dados da pessoa (Nome, Idade)
        public virtual Pessoa? Pessoa { get; set; }
    }
}