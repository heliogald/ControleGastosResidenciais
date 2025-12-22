using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Financas.Api.Models
{
    public class Pessoa
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [JsonIgnore]
        public ICollection<Transacao> Transacoes { get; set; } = new List<Transacao>();

        [Required(ErrorMessage = "O nome é obrigatório")]
        public string Nome { get; set; } = string.Empty;

        [Range(0, 150, ErrorMessage = "A idade deve ser um número positivo")]
        public int Idade { get; set; }
        
    }
}