import React, { useEffect, useState } from "react";
import axios from "axios";
import LoginForm from "./LoginForm";
import FigmaViewer from "./FigmaViewer";

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

type Tab = "todo" | "figma";

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [activeTab, setActiveTab] = useState<Tab>("todo");

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
    <>
      <style>{`
        .app-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 20px;
          background: #ffffff;
          border-bottom: 1px solid #e5e7eb;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .app-header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .app-logo {
          font-size: 20px;
          font-weight: 800;
          color: #1a1a2e;
          margin: 0;
        }

        .app-tabs {
          display: flex;
          gap: 4px;
          background: #f3f4f6;
          border-radius: 8px;
          padding: 3px;
        }

        .app-tab-btn {
          padding: 6px 16px;
          font-size: 13px;
          font-weight: 600;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          background: transparent;
          color: #6b7280;
          transition: background 0.2s ease, color 0.2s ease;
        }

        .app-tab-btn:hover {
          color: #374151;
        }

        .app-tab-btn.active {
          background: #ffffff;
          color: #667eea;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
        }

        .app-header-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .app-user-name {
          font-size: 14px;
          color: #6b7280;
        }

        .app-logout-btn {
          padding: 7px 14px;
          font-size: 13px;
          font-weight: 600;
          border: 1px solid #e5e7eb;
          border-radius: 7px;
          background: #ffffff;
          color: #374151;
          cursor: pointer;
          transition: background 0.2s ease, border-color 0.2s ease;
        }

        .app-logout-btn:hover {
          background: #f9fafb;
          border-color: #d1d5db;
        }

        .app-content {
          padding: 28px 20px;
          max-width: 900px;
          margin: 0 auto;
        }

        .todo-form {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }

        .todo-input {
          flex: 1;
          padding: 10px 14px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .todo-input:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15);
        }

        .todo-add-btn {
          padding: 10px 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #ffffff;
          font-size: 14px;
          font-weight: 600;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          box-shadow: 0 3px 10px rgba(102, 126, 234, 0.3);
          transition: opacity 0.2s ease;
        }

        .todo-add-btn:hover {
          opacity: 0.9;
        }

        .todo-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .todo-item {
          padding: 12px 16px;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
          color: #1f2937;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .todo-item-done {
          text-decoration: line-through;
          color: #9ca3af;
        }

        .todo-badge {
          font-size: 11px;
          font-weight: 600;
          background: #d1fae5;
          color: #065f46;
          padding: 2px 8px;
          border-radius: 99px;
        }
      `}</style>

      <header className="app-header">
        <div className="app-header-left">
          <h1 className="app-logo">Todo</h1>
          <nav className="app-tabs">
            <button
              className={`app-tab-btn${activeTab === "todo" ? " active" : ""}`}
              onClick={() => setActiveTab("todo")}
            >
              ✅ Tarefas
            </button>
            <button
              className={`app-tab-btn${activeTab === "figma" ? " active" : ""}`}
              onClick={() => setActiveTab("figma")}
            >
              🎨 Figma
            </button>
          </nav>
        </div>
        <div className="app-header-right">
          {user && (
            <span className="app-user-name">{user.name || user.email}</span>
          )}
          <button onClick={logout} className="app-logout-btn">
            Sair
          </button>
        </div>
      </header>

      <main className="app-content">
        {activeTab === "todo" && (
          <>
            <form className="todo-form" onSubmit={addTask}>
              <input
                className="todo-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nova tarefa..."
              />
              <button type="submit" className="todo-add-btn">
                Adicionar
              </button>
            </form>
            <ul className="todo-list">
              {tasks.map((t) => (
                <li key={t.id} className="todo-item">
                  <span className={t.completed ? "todo-item-done" : ""}>{t.title}</span>
                  {t.completed && <span className="todo-badge">Concluída</span>}
                </li>
              ))}
            </ul>
          </>
        )}

        {activeTab === "figma" && <FigmaViewer />}
      </main>
    </>
  );
}
