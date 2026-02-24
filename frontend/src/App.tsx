import React, { useEffect, useState } from "react";
import axios from "axios";

type Task = {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
};

type User = {
  id: number;
  email: string;
  name: string | null;
};

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (token) {
      fetchTasks();
    }
  }, [token]);

  async function fetchTasks() {
    const res = await axios.get("/api/tasks", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setTasks(res.data);
  }

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
      const data = isRegister ? { email, password, name } : { email, password };
      const res = await axios.post(endpoint, data);
      const newToken = res.data.token;
      setToken(newToken);
      setUser(res.data.user);
      localStorage.setItem("token", newToken);
      setEmail("");
      setPassword("");
      setName("");
    } catch (err: any) {
      setError(err.response?.data?.error || "Authentication failed");
    }
  }

  function logout() {
    setToken(null);
    setUser(null);
    setTasks([]);
    localStorage.removeItem("token");
  }

  async function addTask(e: React.FormEvent) {
    e.preventDefault();
    if (!title) return;
    await axios.post("/api/tasks", { title }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setTitle("");
    fetchTasks();
  }

  if (!token) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        background: "#f5f5f5"
      }}>
        <div style={{ 
          background: "white", 
          padding: 40, 
          borderRadius: 8, 
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          width: 320
        }}>
          <h2 style={{ marginBottom: 24, textAlign: "center" }}>
            {isRegister ? "Criar Conta" : "Login"}
          </h2>
          <form onSubmit={handleAuth}>
            {isRegister && (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nome"
                style={{ width: "100%", marginBottom: 12, padding: 10, boxSizing: "border-box" }}
              />
            )}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              style={{ width: "100%", marginBottom: 12, padding: 10, boxSizing: "border-box" }}
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Senha"
              style={{ width: "100%", marginBottom: 12, padding: 10, boxSizing: "border-box" }}
            />
            {error && <p style={{ color: "red", marginBottom: 12 }}>{error}</p>}
            <button 
              type="submit" 
              style={{ 
                width: "100%", 
                padding: 12, 
                background: "#007bff", 
                color: "white", 
                border: "none", 
                borderRadius: 4,
                cursor: "pointer"
              }}
            >
              {isRegister ? "Cadastrar" : "Entrar"}
            </button>
          </form>
          <p style={{ marginTop: 16, textAlign: "center" }}>
            {isRegister ? "Já tem conta?" : "Não tem conta?"}{" "}
            <button 
              onClick={() => { setIsRegister(!isRegister); setError(""); }} 
              style={{ background: "none", border: "none", color: "#007bff", cursor: "pointer" }}
            >
              {isRegister ? "Entrar" : "Cadastrar"}
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h1>Todo</h1>
        <button onClick={logout} style={{ padding: "8px 16px", cursor: "pointer" }}>
          Sair
        </button>
      </div>
      <form onSubmit={addTask}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New task"
        />
        <button type="submit">Add</button>
      </form>
      <ul>
        {tasks.map((t) => (
          <li key={t.id}>
            {t.title} {t.completed ? "✅" : ""}
          </li>
        ))}
      </ul>
    </div>
  );
}
