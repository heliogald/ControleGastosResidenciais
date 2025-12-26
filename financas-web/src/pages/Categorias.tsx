import { useEffect, useState } from "react";
import api from "../services/api";

interface Categoria {
  id: string;
  descricao: string;
  finalidade: number;
}

export function Categorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [descricao, setDescricao] = useState("");
  const [finalidade, setFinalidade] = useState(1); // 1: Despesa, 2: Receita, 3: Ambas
  const [editandoId, setEditandoId] = useState<string | null>(null);

  useEffect(() => {
    carregarCategorias();
  }, []);

  async function carregarCategorias() {
    const res = await api.get("/categoria");
    setCategorias(res.data);
  }

  // Função para carregar os dados no formulário para edição
  function prepararEdicao(c: Categoria) {
    setEditandoId(c.id);
    setDescricao(c.descricao);
    setFinalidade(c.finalidade);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Função para limpar o formulário e sair do modo edição
  function cancelarEdicao() {
    setEditandoId(null);
    setDescricao("");
    setFinalidade(1);
  }

  async function handleSalvar(e: React.FormEvent) {
    e.preventDefault();

    const dados = {
      id: editandoId || undefined,
      descricao,
      finalidade: Number(finalidade),
    };

    try {
      if (editandoId) {
        // Lógica de Atualização (PUT)
        await api.put(`/categoria/${editandoId}`, dados);
        alert("Categoria atualizada com sucesso!");
      } else {
        // Lógica de Criação (POST)
        await api.post("/categoria", dados);
        alert("Categoria adicionada com sucesso!");
      }

      cancelarEdicao();
      carregarCategorias();
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar categoria");
    }
  }

  async function excluirCategoria(id: string) {
    if (window.confirm("Deseja realmente excluir esta categoria?")) {
      try {
        await api.delete(`/categoria/${id}`);
        carregarCategorias(); // Recarrega a lista após excluir
      } catch (error: any) {
        // Captura a mensagem real enviada pelo Backend (BadRequest)
        const mensagemErro = error.response?.data || "Erro interno ao excluir.";
        console.error("Detalhes do erro:", error);
        alert(`Atenção: ${mensagemErro}`);
      }
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-8 text-indigo-400">
        {editandoId ? "🔧 Editar Categoria" : "📂 Categorias"}
      </h2>

      <form
        onSubmit={handleSalvar}
        className="bg-slate-800 p-6 rounded-xl border border-slate-700 mb-8 flex flex-col md:flex-row gap-4 shadow-lg"
      >
        <input
          className="flex-1 bg-slate-900 border border-slate-700 p-3 rounded-lg text-white outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Descrição da Categoria (Ex: Aluguel, Salário...)"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          required
        />
        <select
          className="bg-slate-900 border border-slate-700 p-3 rounded-lg text-white outline-none"
          value={finalidade}
          onChange={(e) => setFinalidade(Number(e.target.value))}
        >
          <option value={1}>Despesa</option>
          <option value={2}>Receita</option>
          <option value={3}>Ambas</option>
        </select>

        <div className="flex gap-2">
          <button
            type="submit"
            className={`flex-1 md:flex-none px-8 py-3 rounded-lg font-bold transition-all active:scale-95 ${
              editandoId
                ? "bg-amber-500 hover:bg-amber-600 text-slate-900"
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
            }`}
          >
            {editandoId ? "Atualizar" : "Adicionar"}
          </button>

          {editandoId && (
            <button
              type="button"
              onClick={cancelarEdicao}
              className="px-4 py-3 rounded-lg font-bold bg-slate-700 hover:bg-slate-600 text-white transition-all"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categorias.map((c) => (
          <div
            key={c.id}
            className="bg-slate-800 p-4 rounded-lg border border-slate-700 flex justify-between items-center hover:border-slate-500 transition-colors group"
          >
            <div className="flex flex-col">
              <span className="text-slate-200 font-medium">{c.descricao}</span>
              <span
                className={`text-[10px] uppercase mt-1 w-fit px-2 py-0.5 rounded-full font-bold ${
                  c.finalidade === 1
                    ? "bg-rose-500/20 text-rose-400"
                    : c.finalidade === 2
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-indigo-500/20 text-indigo-400"
                }`}
              >
                {c.finalidade === 1
                  ? "Despesa"
                  : c.finalidade === 2
                  ? "Receita"
                  : "Ambas"}
              </span>
            </div>

            <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => prepararEdicao(c)}
                className="text-indigo-400 hover:text-indigo-300 text-sm font-semibold"
              >
                Editar
              </button>
              <button
                onClick={() => excluirCategoria(c.id)}
                className="text-rose-500 hover:text-rose-400 text-sm font-semibold"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
