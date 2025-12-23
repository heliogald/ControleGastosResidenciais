import axios from "axios";

// Certifique-se de que a porta (5000 ou 5xxx) é a mesma que aparece no dotnet run
const api = axios.create({
  baseURL: "http://localhost:5290/api",
});

export default api;
