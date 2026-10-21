import type { Pessoa } from "./pessoa";
import type { Categoria } from "./categoria";

export interface TransacaoDados {
  descricao: string;
  valor: number;
  tipo: number;
  pessoaId: string;
  categoriaId: string;
}

export interface Transacao extends TransacaoDados {
  id: string;
  pessoa?: Pessoa | null;
  categoria?: Categoria | null;
}
