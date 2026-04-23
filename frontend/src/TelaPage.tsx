import React from "react";
import {
  TrendingUp,
  TrendingDown,
  Users,
  CheckSquare,
  Clock,
  Star,
  MoreVertical,
  Bell,
  Search,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface StatCard {
  id: number;
  label: string;
  value: string;
  change: string;
  positive: boolean;
  icon: React.ReactNode;
  color: string;
}

interface Task {
  id: number;
  title: string;
  assignee: string;
  priority: "Alta" | "Média" | "Baixa";
  status: "Concluída" | "Em andamento" | "Pendente";
  dueDate: string;
}

interface Activity {
  id: number;
  user: string;
  action: string;
  time: string;
  avatar: string;
}

interface Project {
  id: number;
  name: string;
  progress: number;
  color: string;
  tasks: number;
  completed: number;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const STAT_CARDS: StatCard[] = [
  {
    id: 1,
    label: "Total de Tarefas",
    value: "248",
    change: "+12%",
    positive: true,
    icon: <CheckSquare size={22} />,
    color: "#667eea",
  },
  {
    id: 2,
    label: "Usuários Ativos",
    value: "1.430",
    change: "+8%",
    positive: true,
    icon: <Users size={22} />,
    color: "#10b981",
  },
  {
    id: 3,
    label: "Em Andamento",
    value: "74",
    change: "-3%",
    positive: false,
    icon: <Clock size={22} />,
    color: "#f59e0b",
  },
  {
    id: 4,
    label: "Taxa de Conclusão",
    value: "87%",
    change: "+5%",
    positive: true,
    icon: <Star size={22} />,
    color: "#8b5cf6",
  },
];

const TASKS: Task[] = [
  {
    id: 1,
    title: "Redesign da página inicial",
    assignee: "Ana Souza",
    priority: "Alta",
    status: "Em andamento",
    dueDate: "28 Abr",
  },
  {
    id: 2,
    title: "Integração com API de pagamentos",
    assignee: "Carlos Lima",
    priority: "Alta",
    status: "Pendente",
    dueDate: "30 Abr",
  },
  {
    id: 3,
    title: "Testes de regressão — módulo auth",
    assignee: "Beatriz Neto",
    priority: "Média",
    status: "Concluída",
    dueDate: "22 Abr",
  },
  {
    id: 4,
    title: "Documentação da API REST",
    assignee: "Diego Ferreira",
    priority: "Baixa",
    status: "Em andamento",
    dueDate: "05 Mai",
  },
  {
    id: 5,
    title: "Otimização de queries no banco",
    assignee: "Fernanda Costa",
    priority: "Alta",
    status: "Pendente",
    dueDate: "02 Mai",
  },
  {
    id: 6,
    title: "Configurar CI/CD pipeline",
    assignee: "Gabriel Rocha",
    priority: "Média",
    status: "Concluída",
    dueDate: "20 Abr",
  },
];

const ACTIVITIES: Activity[] = [
  {
    id: 1,
    user: "Ana Souza",
    action: "concluiu a tarefa Redesign da página",
    time: "2 min atrás",
    avatar: "AS",
  },
  {
    id: 2,
    user: "Carlos Lima",
    action: "adicionou um comentário em Integração API",
    time: "15 min atrás",
    avatar: "CL",
  },
  {
    id: 3,
    user: "Beatriz Neto",
    action: "criou a tarefa Testes de regressão",
    time: "1 h atrás",
    avatar: "BN",
  },
  {
    id: 4,
    user: "Diego Ferreira",
    action: "atualizou o status de Documentação da API",
    time: "3 h atrás",
    avatar: "DF",
  },
];

const PROJECTS: Project[] = [
  {
    id: 1,
    name: "Portal do Cliente",
    progress: 72,
    color: "#667eea",
    tasks: 34,
    completed: 24,
  },
  {
    id: 2,
    name: "App Mobile v2",
    progress: 45,
    color: "#10b981",
    tasks: 58,
    completed: 26,
  },
  {
    id: 3,
    name: "Dashboard Analytics",
    progress: 91,
    color: "#8b5cf6",
    tasks: 22,
    completed: 20,
  },
  {
    id: 4,
    name: "Migração de Dados",
    progress: 28,
    color: "#f59e0b",
    tasks: 15,
    completed: 4,
  },
];

// ─── Priority badge colours ───────────────────────────────────────────────────

const PRIORITY_COLORS: Record<Task["priority"], { bg: string; text: string }> = {
  Alta: { bg: "#fee2e2", text: "#dc2626" },
  Média: { bg: "#fef3c7", text: "#d97706" },
  Baixa: { bg: "#d1fae5", text: "#059669" },
};

const STATUS_COLORS: Record<Task["status"], { bg: string; text: string }> = {
  Concluída: { bg: "#d1fae5", text: "#059669" },
  "Em andamento": { bg: "#dbeafe", text: "#2563eb" },
  Pendente: { bg: "#f3f4f6", text: "#6b7280" },
};

const AVATAR_COLORS = [
  "#667eea",
  "#10b981",
  "#8b5cf6",
  "#f59e0b",
  "#ef4444",
  "#06b6d4",
];

function avatarColor(index: number): string {
  return AVATAR_COLORS[index % AVATAR_COLORS.length];
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function TelaPage() {
  return (
    <>
      <style>{`
        *,
        *::before,
        *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          background: #f1f5f9;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, sans-serif;
          color: #1e293b;
        }

        .tela-shell {
          min-height: 100vh;
          background: #f1f5f9;
          display: flex;
          flex-direction: column;
        }

        /* ── Topbar ── */
        .tela-topbar {
          position: sticky;
          top: 0;
          z-index: 100;
          background: #ffffff;
          border-bottom: 1px solid #e2e8f0;
          padding: 0 24px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .tela-topbar-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .tela-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 18px;
          font-weight: 700;
          color: #667eea;
          text-decoration: none;
        }

        .tela-logo-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea, #764ba2);
        }

        .tela-search {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 8px 14px;
          min-width: 220px;
          color: #94a3b8;
          font-size: 14px;
        }

        .tela-topbar-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .tela-icon-btn {
          position: relative;
          width: 38px;
          height: 38px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748b;
          cursor: pointer;
          transition: background 0.2s;
        }

        .tela-icon-btn:hover {
          background: #f8fafc;
        }

        .tela-notif-badge {
          position: absolute;
          top: 6px;
          right: 6px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #ef4444;
          border: 2px solid #ffffff;
        }

        .tela-user-chip {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 6px 12px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          cursor: pointer;
        }

        .tela-user-avatar {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          font-size: 11px;
          font-weight: 700;
          flex-shrink: 0;
        }

        .tela-user-info {
          display: flex;
          flex-direction: column;
        }

        .tela-user-name {
          font-size: 13px;
          font-weight: 600;
          color: #1e293b;
          line-height: 1.2;
        }

        .tela-user-role {
          font-size: 11px;
          color: #94a3b8;
        }

        /* ── Main content ── */
        .tela-main {
          flex: 1;
          padding: 28px 24px;
          max-width: 1280px;
          width: 100%;
          margin: 0 auto;
        }

        /* ── Page header ── */
        .tela-page-header {
          margin-bottom: 28px;
        }

        .tela-page-title {
          font-size: 24px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 4px;
        }

        .tela-page-subtitle {
          font-size: 14px;
          color: #64748b;
        }

        /* ── Stat cards ── */
        .tela-stat-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 28px;
        }

        .tela-stat-card {
          background: #ffffff;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
          border: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .tela-stat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .tela-stat-icon {
          width: 42px;
          height: 42px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          flex-shrink: 0;
        }

        .tela-stat-more {
          color: #cbd5e1;
          cursor: pointer;
        }

        .tela-stat-value {
          font-size: 28px;
          font-weight: 700;
          color: #0f172a;
          line-height: 1;
        }

        .tela-stat-footer {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .tela-stat-label {
          font-size: 13px;
          color: #64748b;
          flex: 1;
        }

        .tela-stat-change {
          display: flex;
          align-items: center;
          gap: 3px;
          font-size: 12px;
          font-weight: 600;
          padding: 2px 7px;
          border-radius: 20px;
          flex-shrink: 0;
        }

        .tela-stat-change.positive {
          background: #d1fae5;
          color: #059669;
        }

        .tela-stat-change.negative {
          background: #fee2e2;
          color: #dc2626;
        }

        /* ── Middle row ── */
        .tela-mid-row {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 16px;
          margin-bottom: 28px;
        }

        /* ── Section card ── */
        .tela-section-card {
          background: #ffffff;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
          overflow: hidden;
        }

        .tela-section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 20px 14px;
          border-bottom: 1px solid #f1f5f9;
        }

        .tela-section-title {
          font-size: 15px;
          font-weight: 600;
          color: #0f172a;
        }

        .tela-section-badge {
          background: #f1f5f9;
          color: #64748b;
          font-size: 12px;
          font-weight: 600;
          padding: 3px 10px;
          border-radius: 20px;
        }

        .tela-section-action {
          font-size: 13px;
          font-weight: 600;
          color: #667eea;
          cursor: pointer;
          text-decoration: none;
          background: none;
          border: none;
          padding: 0;
        }

        /* ── Task table ── */
        .tela-table-wrap {
          overflow-x: auto;
        }

        .tela-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13.5px;
        }

        .tela-table th {
          text-align: left;
          padding: 10px 20px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #94a3b8;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
          white-space: nowrap;
        }

        .tela-table td {
          padding: 13px 20px;
          border-bottom: 1px solid #f1f5f9;
          vertical-align: middle;
        }

        .tela-table tr:last-child td {
          border-bottom: none;
        }

        .tela-table tr:hover td {
          background: #f8fafc;
        }

        .tela-task-title {
          font-weight: 500;
          color: #1e293b;
          max-width: 260px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .tela-badge {
          display: inline-block;
          padding: 3px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          white-space: nowrap;
        }

        .tela-assignee {
          display: flex;
          align-items: center;
          gap: 8px;
          white-space: nowrap;
        }

        .tela-mini-avatar {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          font-size: 10px;
          font-weight: 700;
          flex-shrink: 0;
        }

        .tela-due {
          font-size: 12px;
          color: #94a3b8;
          white-space: nowrap;
        }

        /* ── Activity feed ── */
        .tela-activity-list {
          padding: 0 20px;
        }

        .tela-activity-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 14px 0;
          border-bottom: 1px solid #f1f5f9;
        }

        .tela-activity-item:last-child {
          border-bottom: none;
        }

        .tela-activity-avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          font-size: 11px;
          font-weight: 700;
          flex-shrink: 0;
        }

        .tela-activity-text {
          flex: 1;
          min-width: 0;
        }

        .tela-activity-user {
          font-size: 13px;
          font-weight: 600;
          color: #1e293b;
          display: inline;
        }

        .tela-activity-action {
          font-size: 13px;
          color: #64748b;
          display: inline;
        }

        .tela-activity-time {
          font-size: 11px;
          color: #94a3b8;
          margin-top: 2px;
        }

        /* ── Bottom row (projects) ── */
        .tela-projects-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .tela-project-item {
          padding: 18px 20px;
          border-bottom: 1px solid #f1f5f9;
        }

        .tela-project-item:nth-child(3),
        .tela-project-item:nth-child(4) {
          border-bottom: none;
        }

        .tela-project-item-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
        }

        .tela-project-name {
          font-size: 14px;
          font-weight: 600;
          color: #1e293b;
        }

        .tela-project-pct {
          font-size: 13px;
          font-weight: 700;
          color: #1e293b;
        }

        .tela-progress-bar {
          height: 6px;
          background: #e2e8f0;
          border-radius: 99px;
          overflow: hidden;
          margin-bottom: 8px;
        }

        .tela-progress-fill {
          height: 100%;
          border-radius: 99px;
          transition: width 0.3s ease;
        }

        .tela-project-meta {
          font-size: 12px;
          color: #94a3b8;
        }

        /* ── Responsive ── */
        @media (max-width: 1023px) {
          .tela-stat-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .tela-mid-row {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 639px) {
          .tela-topbar {
            padding: 0 16px;
          }

          .tela-search {
            display: none;
          }

          .tela-user-info {
            display: none;
          }

          .tela-main {
            padding: 20px 16px;
          }

          .tela-stat-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }

          .tela-stat-value {
            font-size: 22px;
          }

          .tela-projects-grid {
            grid-template-columns: 1fr;
          }

          .tela-project-item:nth-child(3) {
            border-bottom: 1px solid #f1f5f9;
          }

          .tela-project-item:last-child {
            border-bottom: none;
          }
        }

        @media (max-width: 399px) {
          .tela-stat-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="tela-shell">
        {/* Topbar */}
        <header className="tela-topbar">
          <div className="tela-topbar-left">
            <div className="tela-logo">
              <div className="tela-logo-dot" />
              Nova
            </div>
            <div className="tela-search">
              <Search size={15} />
              Buscar tarefas…
            </div>
          </div>

          <div className="tela-topbar-right">
            <div className="tela-icon-btn" role="button" aria-label="Notificações">
              <Bell size={18} />
              <span className="tela-notif-badge" />
            </div>
            <div className="tela-user-chip">
              <div className="tela-user-avatar">MR</div>
              <div className="tela-user-info">
                <span className="tela-user-name">Maria Ramos</span>
                <span className="tela-user-role">Gerente de Produto</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="tela-main">
          {/* Page header */}
          <div className="tela-page-header">
            <h1 className="tela-page-title">Dashboard</h1>
            <p className="tela-page-subtitle">
              Bem-vinda de volta, Maria — aqui está o resumo de hoje.
            </p>
          </div>

          {/* Stat cards */}
          <div className="tela-stat-grid">
            {STAT_CARDS.map((card) => (
              <div key={card.id} className="tela-stat-card">
                <div className="tela-stat-header">
                  <div
                    className="tela-stat-icon"
                    style={{ background: card.color }}
                  >
                    {card.icon}
                  </div>
                  <div className="tela-stat-more">
                    <MoreVertical size={16} />
                  </div>
                </div>

                <div className="tela-stat-value">{card.value}</div>

                <div className="tela-stat-footer">
                  <span className="tela-stat-label">{card.label}</span>
                  <span
                    className={`tela-stat-change ${card.positive ? "positive" : "negative"}`}
                  >
                    {card.positive ? (
                      <TrendingUp size={11} />
                    ) : (
                      <TrendingDown size={11} />
                    )}
                    {card.change}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Middle row: Task table + Activity feed */}
          <div className="tela-mid-row">
            {/* Task table */}
            <div className="tela-section-card">
              <div className="tela-section-header">
                <span className="tela-section-title">Tarefas Recentes</span>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span className="tela-section-badge">{TASKS.length} tarefas</span>
                  <button className="tela-section-action">Ver todas</button>
                </div>
              </div>
              <div className="tela-table-wrap">
                <table className="tela-table">
                  <thead>
                    <tr>
                      <th>Tarefa</th>
                      <th>Responsável</th>
                      <th>Prioridade</th>
                      <th>Status</th>
                      <th>Prazo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {TASKS.map((task, idx) => {
                      const pColors = PRIORITY_COLORS[task.priority];
                      const sColors = STATUS_COLORS[task.status];
                      return (
                        <tr key={task.id}>
                          <td>
                            <span className="tela-task-title">{task.title}</span>
                          </td>
                          <td>
                            <div className="tela-assignee">
                              <div
                                className="tela-mini-avatar"
                                style={{ background: avatarColor(idx) }}
                              >
                                {task.assignee
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .slice(0, 2)}
                              </div>
                              {task.assignee.split(" ")[0]}
                            </div>
                          </td>
                          <td>
                            <span
                              className="tela-badge"
                              style={{
                                background: pColors.bg,
                                color: pColors.text,
                              }}
                            >
                              {task.priority}
                            </span>
                          </td>
                          <td>
                            <span
                              className="tela-badge"
                              style={{
                                background: sColors.bg,
                                color: sColors.text,
                              }}
                            >
                              {task.status}
                            </span>
                          </td>
                          <td>
                            <span className="tela-due">{task.dueDate}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Activity feed */}
            <div className="tela-section-card">
              <div className="tela-section-header">
                <span className="tela-section-title">Atividade Recente</span>
                <button className="tela-section-action">Ver tudo</button>
              </div>
              <div className="tela-activity-list">
                {ACTIVITIES.map((act, idx) => (
                  <div key={act.id} className="tela-activity-item">
                    <div
                      className="tela-activity-avatar"
                      style={{ background: avatarColor(idx) }}
                    >
                      {act.avatar}
                    </div>
                    <div className="tela-activity-text">
                      <span className="tela-activity-user">{act.user} </span>
                      <span className="tela-activity-action">{act.action}</span>
                      <div className="tela-activity-time">{act.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Projects section */}
          <div className="tela-section-card">
            <div className="tela-section-header">
              <span className="tela-section-title">Projetos Ativos</span>
              <button className="tela-section-action">Ver todos os projetos</button>
            </div>
            <div className="tela-projects-grid">
              {PROJECTS.map((proj) => (
                <div key={proj.id} className="tela-project-item">
                  <div className="tela-project-item-header">
                    <span className="tela-project-name">{proj.name}</span>
                    <span className="tela-project-pct">{proj.progress}%</span>
                  </div>
                  <div className="tela-progress-bar">
                    <div
                      className="tela-progress-fill"
                      style={{
                        width: `${proj.progress}%`,
                        background: proj.color,
                      }}
                    />
                  </div>
                  <div className="tela-project-meta">
                    {proj.completed} de {proj.tasks} tarefas concluídas
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
