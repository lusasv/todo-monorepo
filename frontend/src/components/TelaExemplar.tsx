import React from "react";

type Todo = {
  id: number;
  title: string;
  description: string;
  completed: boolean;
};

const FAKE_TODOS: Todo[] = [
  { id: 1, title: "Revisar pull request do colega", description: "Checar cobertura de testes e padroes de codigo", completed: true },
  { id: 2, title: "Escrever testes unitarios", description: "Cobrir os novos endpoints de autenticacao", completed: false },
  { id: 3, title: "Atualizar documentacao da API", description: "Incluir exemplos de request e response", completed: false },
  { id: 4, title: "Configurar CI/CD", description: "Pipeline de build e deploy automatico no GitHub Actions", completed: true },
  { id: 5, title: "Refinamento com o PO", description: "Alinhar criterios de aceite da proxima sprint", completed: false },
];

export default function TelaExemplar() {
  const completed = FAKE_TODOS.filter((t) => t.completed).length;
  const total = FAKE_TODOS.length;

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
          padding: 32px 16px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, sans-serif;
        }

        .tela-card {
          background: #ffffff;
          border-radius: 12px;
          padding: 40px;
          width: 100%;
          max-width: 560px;
          margin: 0 auto;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
        }

        .tela-header {
          margin-bottom: 28px;
        }

        .tela-title {
          font-size: 28px;
          font-weight: 700;
          color: #1a1a2e;
          margin: 0 0 6px;
        }

        .tela-subtitle {
          font-size: 14px;
          color: #6b7280;
          margin: 0 0 20px;
        }

        .tela-progress-bar-bg {
          height: 8px;
          background: #e5e7eb;
          border-radius: 99px;
          overflow: hidden;
        }

        .tela-progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
          border-radius: 99px;
          transition: width 0.4s ease;
        }

        .tela-progress-label {
          font-size: 13px;
          color: #6b7280;
          margin-top: 6px;
        }

        .tela-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .tela-item {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 16px;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          background: #f9fafb;
          transition: border-color 0.2s ease;
        }

        .tela-item.item-done {
          background: #f0fdf4;
          border-color: #bbf7d0;
        }

        .tela-checkbox {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 2px solid #d1d5db;
          flex-shrink: 0;
          margin-top: 2px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #ffffff;
        }

        .tela-checkbox.checked {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-color: transparent;
        }

        .tela-checkbox-tick {
          width: 10px;
          height: 10px;
          color: #ffffff;
        }

        .tela-item-body {
          flex: 1;
          min-width: 0;
        }

        .tela-item-title {
          font-size: 15px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 4px;
        }

        .tela-item-title.done-title {
          text-decoration: line-through;
          color: #9ca3af;
        }

        .tela-item-desc {
          font-size: 13px;
          color: #6b7280;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .tela-badge {
          font-size: 11px;
          font-weight: 600;
          padding: 3px 10px;
          border-radius: 99px;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .tela-badge.badge-done {
          background: #dcfce7;
          color: #15803d;
        }

        .tela-badge.badge-pending {
          background: #eff6ff;
          color: #1d4ed8;
        }

        .tela-back-link {
          display: inline-block;
          margin-top: 24px;
          font-size: 14px;
          color: #667eea;
          font-weight: 600;
          cursor: pointer;
          background: none;
          border: none;
          padding: 0;
          text-decoration: underline;
          transition: color 0.2s ease;
        }

        .tela-back-link:hover {
          color: #764ba2;
        }

        @media (max-width: 767px) {
          .tela-card {
            padding: 24px 16px;
            box-shadow: none;
            border-radius: 8px;
          }
        }
      `}</style>

      <div className="tela-wrapper">
        <div className="tela-card">
          <div className="tela-header">
            <h1 className="tela-title">Minhas Tarefas</h1>
            <p className="tela-subtitle">Acompanhe o progresso das suas atividades</p>
            <div className="tela-progress-bar-bg">
              <div
                className="tela-progress-bar-fill"
                style={{ width: `${Math.round((completed / total) * 100)}%` }}
              />
            </div>
            <p className="tela-progress-label">
              {completed} de {total} tarefas concluidas
            </p>
          </div>

          <ul className="tela-list">
            {FAKE_TODOS.map((todo) => (
              <li key={todo.id} className={`tela-item${todo.completed ? " item-done" : ""}`}>
                <div className={`tela-checkbox${todo.completed ? " checked" : ""}`}>
                  {todo.completed && (
                    <svg className="tela-checkbox-tick" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1.5 5L4 7.5L8.5 2.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <div className="tela-item-body">
                  <p className={`tela-item-title${todo.completed ? " done-title" : ""}`}>
                    {todo.title}
                  </p>
                  <p className="tela-item-desc">{todo.description}</p>
                </div>
                <span className={`tela-badge${todo.completed ? " badge-done" : " badge-pending"}`}>
                  {todo.completed ? "Feito" : "Pendente"}
                </span>
              </li>
            ))}
          </ul>

          <button
            className="tela-back-link"
            onClick={() => { window.location.pathname = "/"; }}
          >
            Voltar ao inicio
          </button>
        </div>
      </div>
    </>
  );
}
