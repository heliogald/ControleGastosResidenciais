import { useEffect, useState } from "react";
import { pessoaService, type Pessoa } from "../services/pessoaService";

export function Pessoas() {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [nome, setNome] = useState("");
  const [idade, setIdade] = useState("");
  const [editandoId, setEditandoId] = useState<string | null>(null);

  useEffect(() => {
    carregarPessoas();
  }, []);

  async function carregarPessoas() {
    try {
      const response = await pessoaService.listar();
      setPessoas(response.data);
    } catch (error) {
      console.error("Erro ao carregar lista", error);
    }
  }

  function prepararEdicao(p: Pessoa) {
    setEditandoId(p.id!);
    setNome(p.nome);
    setIdade(p.idade.toString());
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSalvar(e: React.FormEvent) {
    e.preventDefault();

    if (!nome.trim() || !idade) {
      alert("Preencha todos os campos.");
      return;
    }

    const payload: Pessoa = {
      id: editandoId || undefined,
      nome: nome.trim(),
      idade: Number(idade),
    };

    try {
      if (editandoId) {
        await pessoaService.atualizar(editandoId, payload);
      } else {
        await pessoaService.criar(payload);
      }

      setEditandoId(null);
      setNome("");
      setIdade("");
      await carregarPessoas();
      alert("Dados salvos com sucesso!");
    } catch (error: any) {
      console.error("Erro detalhado:", error.response?.data);
      alert(
        "Erro ao salvar: " + (error.response?.data || "Verifique os dados.")
      );
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-8 text-indigo-400 text-center">
        {editandoId ? "🔧 Editar Pessoa" : "👥 Gerenciar Pessoas"}
      </h2>

      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 mb-10 shadow-2xl">
        <form
          onSubmit={handleSalvar}
          className="flex flex-col md:flex-row gap-4"
        >
          <input
            className="flex-1 bg-slate-900 border border-slate-600 p-3 rounded-lg text-white outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Nome Completo"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <input
            className="w-full md:w-24 bg-slate-900 border border-slate-600 p-3 rounded-lg text-white outline-none focus:ring-2 focus:ring-indigo-500"
            type="number"
            placeholder="Idade"
            value={idade}
            onChange={(e) => setIdade(e.target.value)}
          />
          <button
            type="submit"
            className={`font-bold py-3 px-8 rounded-lg transition-all active:scale-95 shadow-lg ${
              editandoId
                ? "bg-amber-500 hover:bg-amber-600 text-slate-900"
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
            }`}
          >
            {editandoId ? "Atualizar" : "Cadastrar"}
          </button>
          {editandoId && (
            <button
              type="button"
              onClick={() => {
                setEditandoId(null);
                setNome("");
                setIdade("");
              }}
              className="text-slate-400 hover:text-white underline text-sm px-2"
            >
              Cancelar
            </button>
          )}
        </form>
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-700/50 text-slate-200 border-b border-slate-700">
            <tr>
              <th className="p-4 font-semibold">Nome</th>
              <th className="p-4 text-center font-semibold">Idade</th>
              <th className="p-4 text-right font-semibold">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {pessoas.map((p) => (
              <tr
                key={p.id}
                className="hover:bg-slate-700/30 transition-colors"
              >
                <td className="p-4 text-slate-200">{p.nome}</td>
                <td className="p-4 text-center text-slate-400">
                  {p.idade} anos
                </td>
                <td className="p-4 text-right space-x-4">
                  <button
                    onClick={() => prepararEdicao(p)}
                    className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() =>
                      p.id && pessoaService.deletar(p.id).then(carregarPessoas)
                    }
                    className="text-rose-500 hover:text-rose-400 font-medium transition-colors"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
