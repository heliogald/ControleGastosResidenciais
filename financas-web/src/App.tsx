import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Pessoas } from "./pages/Pessoas";
import { Relatorios } from "./pages/Relatorios";
import { Categorias } from "./pages/Categorias";
import { Transacoes } from "./pages/Transacoes";

function App() {
  return (
    <Router>
      {/* Container Principal com Fundo Escuro */}
      <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
        {/* Barra de Navegação Estilizada */}
        <nav className="bg-slate-800 border-b border-slate-700 px-6 py-4 sticky top-0 z-10 shadow-lg">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <h1 className="text-xl font-bold text-indigo-500 hidden md:block">
              FinançasApp
            </h1>

            <div className="flex gap-6 items-center">
              <Link
                to="/pessoas"
                className="hover:text-indigo-400 transition-colors font-medium"
              >
                Pessoas
              </Link>
              <Link
                to="/categorias"
                className="hover:text-indigo-400 transition-colors font-medium"
              >
                Categorias
              </Link>
              <Link
                to="/transacoes"
                className="hover:text-indigo-400 transition-colors font-medium"
              >
                Lançamentos
              </Link>
              <Link
                to="/relatorios"
                className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition-all font-bold text-sm shadow-md"
              >
                Relatórios
              </Link>
            </div>
          </div>
        </nav>

        {/* Área de Conteúdo */}
        <main className="max-w-5xl mx-auto p-6">
          <Routes>
            <Route path="/pessoas" element={<Pessoas />} />
            <Route path="/relatorios" element={<Relatorios />} />
            <Route path="/categorias" element={<Categorias />} />
            <Route path="/transacoes" element={<Transacoes />} />
            <Route
              path="/"
              element={
                <div className="text-center py-20">
                  <h1 className="text-4xl font-extrabold text-white mb-4">
                    Bem-vindo ao Sistema de Finanças
                  </h1>
                  <p className="text-slate-400 text-lg">
                    Gerencie seus gastos e receitas de forma simples e
                    eficiente.
                  </p>
                </div>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
