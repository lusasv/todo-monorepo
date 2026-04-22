import React, { useEffect, useState } from "react";
import axios from "axios";
import LoginForm from "./LoginForm";
import TelaExemplar from "./components/TelaExemplar";

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

function TodoApp() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

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

  function handleAuthSuccess(newToken: string, newUser: User) {
    setToken(newToken);
    setUser(newUser);
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
    return <LoginForm onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h1>Todo</h1>
        {user && (
          <span style={{ fontSize: 14, color: "#6b7280", marginRight: 12 }}>
            {user.name || user.email}
          </span>
        )}
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
            {t.title} {t.completed ? "done" : ""}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function App() {
  if (window.location.pathname === "/tela") {
    return <TelaExemplar />;
  }
  return <TodoApp />;
}
