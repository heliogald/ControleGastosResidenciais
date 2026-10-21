export interface PessoaDados {
  nome: string;
  idade: number;
}

export interface Pessoa extends PessoaDados {
  id: string;
}
