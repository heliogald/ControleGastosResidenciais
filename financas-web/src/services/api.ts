import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5290/api", // Verifique se a sua URL/Porta está correta
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
