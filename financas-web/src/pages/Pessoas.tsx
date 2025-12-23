import { useEffect, useState } from "react";
import api from "../services/api";

interface Pessoa {
  id?: string;
  nome: string;
  idade: number;
}

export function Pessoas() {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [nome, setNome] = useState("");
  const [idade, setIdade] = useState<string>(""); // Usamos string para o input e convertemos depois

  useEffect(() => {
    buscarPessoas();
  }, []);

  async function buscarPessoas() {
    try {
      const response = await api.get("/pessoas");
      setPessoas(response.data);
    } catch (error) {
      console.error("Erro ao carregar pessoas", error);
    }
  }

  async function handleSalvar(e: React.FormEvent) {
    e.preventDefault();
    if (!nome || !idade) return;

    try {
      await api.post("/pessoas", { nome, idade: Number(idade) });
      setNome("");
      setIdade("");
      buscarPessoas(); // Atualiza a lista após salvar
    } catch (error) {
      alert("Erro ao cadastrar pessoa.");
    }
  }

  async function handleDeletar(id: string) {
    if (
      window.confirm(
        "Ao excluir esta pessoa, todas as transações dela serão apagadas. Deseja continuar?"
      )
    ) {
      try {
        await api.delete(`/pessoas/${id}`);
        buscarPessoas();
      } catch (error) {
        alert("Erro ao deletar pessoa.");
      }
    }
  }

  return (
    <div>
      <h2>Gerenciar Pessoas</h2>

      <form onSubmit={handleSalvar} style={{ marginBottom: "20px" }}>
        <input
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <input
          type="number"
          placeholder="Idade"
          value={idade}
          onChange={(e) => setIdade(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <button type="submit">Cadastrar</button>
      </form>

      <table border={1} style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#f4f4f4" }}>
            <th>Nome</th>
            <th>Idade</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {pessoas.map((p) => (
            <tr key={p.id}>
              <td>{p.nome}</td>
              <td>{p.idade}</td>
              <td>
                <button
                  onClick={() => p.id && handleDeletar(p.id)}
                  style={{ color: "red" }}
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
