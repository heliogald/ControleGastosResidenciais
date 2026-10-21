import { isAxiosError } from "axios";

// Respostas de erro podem conter texto ou ProblemDetails.
export function mensagemErro(error: unknown, fallback: string): string {
  if (!isAxiosError<unknown>(error)) return fallback;
  const dados = error.response?.data;
  if (typeof dados === "string" && dados.trim()) return dados;
  if (typeof dados === "object" && dados !== null) {
    if ("detail" in dados && typeof dados.detail === "string" && dados.detail.trim()) {
      return dados.detail;
    }
    if ("title" in dados && typeof dados.title === "string" && dados.title.trim()) {
      return dados.title;
    }
  }
  return fallback;
}
