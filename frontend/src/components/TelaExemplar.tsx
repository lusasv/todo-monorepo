import React, { useState } from "react";

interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

const FAKE_TODOS: Todo[] = [
  {
    id: 1,
    title: "Comprar mantimentos",
    description: "Leite, ovos, pao e frutas da semana",
    completed: true,
  },
  {
    id: 2,
    title: "Estudar TypeScript",
    description: "Revisar generics, utility types e strict mode",
    completed: false,
  },
  {
    id: 3,
    title: "Fazer exercicios",
    description: "30 minutos de corrida e alongamento",
    completed: false,
  },
  {
    id: 4,
    title: "Revisar pull request",
    description: "Analisar PR #42 do repositorio do time",
    completed: true,
  },
  {
    id: 5,
    title: "Planejar sprint",
    description: "Preparar backlog e priorizar tarefas para proxima semana",
    completed: false,
  },
];

export default function TelaExemplar() {
  const [todos, setTodos] = useState<Todo[]>(FAKE_TODOS);
  const [filter, setFilter] = useState<"all" | "pending" | "done">("all");

  function toggleTodo(id: number) {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }

  const filtered = todos.filter((t) => {
    if (filter === "pending") return !t.completed;
    if (filter === "done") return t.completed;
    return true;
  });

  const doneCount = todos.filter((t) => t.completed).length;
  const totalCount = todos.length;

  return (
    <>
      <style>{`
        *,
        *::before,
        *::after {
          box-sizing: border-box;
        }

        .tela-wrapper {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 32px 16px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, sans-serif;
        }

        .tela-container {
          width: 100%;
          max-width: 640px;
        }

        .tela-header {
          margin-bottom: 24px;
        }

        .tela-title {
          font-size: 32px;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 4px;
        }

        .tela-subtitle {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.8);
          margin: 0;
        }

        .tela-progress-card {
          background: rgba(255, 255, 255, 0.15);
          border-radius: 12px;
          padding: 16px 20px;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 16px;
          backdrop-filter: blur(4px);
        }

        .tela-progress-text {
          color: #ffffff;
          font-size: 14px;
          font-weight: 600;
          white-space: nowrap;
        }

        .tela-progress-bar-bg {
          flex: 1;
          height: 8px;
          background: rgba(255, 255, 255, 0.25);
          border-radius: 4px;
          overflow: hidden;
        }

        .tela-progress-bar-fill {
          height: 100%;
          background: #ffffff;
          border-radius: 4px;
          transition: width 0.3s ease;
        }

        .tela-filters {
          display: flex;
          gap: 8px;
          margin-bottom: 16px;
        }

        .tela-filter-btn {
          padding: 7px 16px;
          border-radius: 20px;
          border: 2px solid rgba(255, 255, 255, 0.5);
          background: transparent;
          color: rgba(255, 255, 255, 0.85);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;
        }

        .tela-filter-btn:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.8);
          color: #ffffff;
        }

        .tela-filter-btn.active {
          background: #ffffff;
          border-color: #ffffff;
          color: #764ba2;
        }

        .tela-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .tela-card {
          background: #ffffff;
          border-radius: 12px;
          padding: 18px 20px;
          display: flex;
          align-items: flex-start;
          gap: 14px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
          cursor: pointer;
        }

        .tela-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.16);
        }

        .tela-card.done {
          opacity: 0.72;
        }

        .tela-checkbox {
          flex-shrink: 0;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          border: 2px solid #d1d5db;
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 1px;
          transition: background 0.2s ease, border-color 0.2s ease;
        }

        .tela-checkbox.checked {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-color: transparent;
        }

        .tela-checkbox-icon {
          width: 12px;
          height: 12px;
          stroke: #ffffff;
          fill: none;
          stroke-width: 2.5;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .tela-card-content {
          flex: 1;
          min-width: 0;
        }

        .tela-card-title {
          font-size: 15px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 4px;
          transition: color 0.2s ease;
        }

        .tela-card-title.done {
          color: #9ca3af;
          text-decoration: line-through;
        }

        .tela-card-description {
          font-size: 13px;
          color: #6b7280;
          margin: 0;
          line-height: 1.5;
        }

        .tela-badge {
          flex-shrink: 0;
          font-size: 11px;
          font-weight: 700;
          padding: 3px 9px;
          border-radius: 10px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .tela-badge.done {
          background: #d1fae5;
          color: #065f46;
        }

        .tela-badge.pending {
          background: #fef3c7;
          color: #92400e;
        }

        .tela-empty {
          text-align: center;
          padding: 40px 20px;
          color: rgba(255, 255, 255, 0.75);
          font-size: 14px;
        }

        @media (max-width: 767px) {
          .tela-wrapper {
            padding: 20px 12px;
          }

          .tela-title {
            font-size: 26px;
          }

          .tela-card {
            padding: 14px 16px;
          }

          .tela-filters {
            flex-wrap: wrap;
          }
        }

        @media (min-width: 768px) and (max-width: 1023px) {
          .tela-container {
            max-width: 580px;
          }
        }

        @media (min-width: 1024px) {
          .tela-container {
            max-width: 640px;
          }
        }
      `}</style>

      <div className="tela-wrapper">
        <div className="tela-container">
          <div className="tela-header">
            <h1 className="tela-title">Meus Todos</h1>
            <p className="tela-subtitle">Tela exemplar com dados mockados</p>
          </div>

          <div className="tela-progress-card">
            <span className="tela-progress-text">
              {doneCount}/{totalCount} concluidos
            </span>
            <div className="tela-progress-bar-bg">
              <div
                className="tela-progress-bar-fill"
                style={{ width: totalCount > 0 ? `${(doneCount / totalCount) * 100}%` : "0%" }}
              />
            </div>
          </div>

          <div className="tela-filters">
            {(["all", "pending", "done"] as const).map((f) => (
              <button
                key={f}
                className={`tela-filter-btn${filter === f ? " active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f === "all" ? "Todos" : f === "pending" ? "Pendentes" : "Concluidos"}
              </button>
            ))}
          </div>

          <div className="tela-list">
            {filtered.length === 0 ? (
              <p className="tela-empty">Nenhum item encontrado.</p>
            ) : (
              filtered.map((todo) => (
                <div
                  key={todo.id}
                  className={`tela-card${todo.completed ? " done" : ""}`}
                  onClick={() => toggleTodo(todo.id)}
                  role="button"
                  aria-pressed={todo.completed}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggleTodo(todo.id);
                    }
                  }}
                >
                  <div className={`tela-checkbox${todo.completed ? " checked" : ""}`}>
                    {todo.completed && (
                      <svg className="tela-checkbox-icon" viewBox="0 0 12 12">
                        <polyline points="1.5,6 4.5,9 10.5,3" />
                      </svg>
                    )}
                  </div>
                  <div className="tela-card-content">
                    <p className={`tela-card-title${todo.completed ? " done" : ""}`}>
                      {todo.title}
                    </p>
                    <p className="tela-card-description">{todo.description}</p>
                  </div>
                  <span className={`tela-badge${todo.completed ? " done" : " pending"}`}>
                    {todo.completed ? "Feito" : "Pendente"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
