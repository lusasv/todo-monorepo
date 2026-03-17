import React, { useState } from "react";
import axios from "axios";

interface FigmaResponse {
  previewUrl: string;
  nodes: object;
}

export default function FigmaViewer() {
  const [fileKey, setFileKey] = useState("");
  const [data, setData] = useState<FigmaResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleFetch(e: React.FormEvent) {
    e.preventDefault();
    const key = fileKey.trim();
    if (!key) {
      setError("Por favor, informe um fileKey do Figma.");
      return;
    }
    setError("");
    setData(null);
    setLoading(true);
    try {
      const res = await axios.get<FigmaResponse>(`/api/figma/${encodeURIComponent(key)}`);
      setData(res.data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const msg = err.response?.data?.error ?? "Erro ao buscar dados do Figma.";
        setError(msg);
      } else {
        setError("Erro ao buscar dados do Figma.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{`
        .figma-viewer {
          max-width: 900px;
          margin: 0 auto;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, sans-serif;
        }

        .figma-section-title {
          font-size: 20px;
          font-weight: 700;
          color: #1a1a2e;
          margin: 0 0 6px;
        }

        .figma-section-desc {
          font-size: 14px;
          color: #6b7280;
          margin: 0 0 24px;
        }

        .figma-form {
          display: flex;
          gap: 10px;
          align-items: flex-start;
          flex-wrap: wrap;
          margin-bottom: 24px;
        }

        .figma-input-wrapper {
          flex: 1;
          min-width: 200px;
        }

        .figma-input {
          width: 100%;
          padding: 11px 14px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
          color: #1f2937;
          background: #f9fafb;
          outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
          font-family: 'SF Mono', 'Fira Code', 'Fira Mono', monospace;
        }

        .figma-input:focus {
          border-color: #667eea;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15);
        }

        .figma-input.input-error {
          border-color: #ef4444;
        }

        .figma-btn {
          padding: 11px 22px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #ffffff;
          font-size: 14px;
          font-weight: 600;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          white-space: nowrap;
          transition: opacity 0.2s ease, transform 0.1s ease, box-shadow 0.2s ease;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.35);
        }

        .figma-btn:hover:not(:disabled) {
          opacity: 0.92;
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(102, 126, 234, 0.45);
        }

        .figma-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .figma-btn:disabled {
          opacity: 0.55;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .figma-error-banner {
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 8px;
          padding: 12px 16px;
          margin-bottom: 20px;
          font-size: 14px;
          color: #b91c1c;
        }

        .figma-loading {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #667eea;
          font-size: 14px;
          font-weight: 500;
          padding: 16px 0;
        }

        .figma-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid #e5e7eb;
          border-top-color: #667eea;
          border-radius: 50%;
          animation: figma-spin 0.8s linear infinite;
          flex-shrink: 0;
        }

        @keyframes figma-spin {
          to { transform: rotate(360deg); }
        }

        .figma-results {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .figma-card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        }

        .figma-card-header {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 18px;
          border-bottom: 1px solid #e5e7eb;
          background: #f9fafb;
        }

        .figma-card-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          flex-shrink: 0;
        }

        .figma-card-icon.preview {
          background: #ede9fe;
        }

        .figma-card-icon.nodes {
          background: #dcfce7;
        }

        .figma-card-title {
          font-size: 14px;
          font-weight: 600;
          color: #374151;
        }

        .figma-card-subtitle {
          font-size: 12px;
          color: #9ca3af;
          margin-left: auto;
        }

        .figma-card-body {
          padding: 18px;
        }

        .figma-preview-img {
          display: block;
          max-width: 100%;
          border-radius: 6px;
          border: 1px solid #e5e7eb;
          background: #f3f4f6;
        }

        .figma-preview-url {
          margin-top: 10px;
          font-size: 12px;
          color: #9ca3af;
          word-break: break-all;
        }

        .figma-preview-url a {
          color: #667eea;
          text-decoration: none;
        }

        .figma-preview-url a:hover {
          text-decoration: underline;
        }

        .figma-json-pre {
          background: #0f172a;
          color: #e2e8f0;
          border-radius: 6px;
          padding: 16px;
          font-size: 12px;
          font-family: 'SF Mono', 'Fira Code', 'Fira Mono', 'Courier New', monospace;
          overflow: auto;
          max-height: 400px;
          line-height: 1.6;
          margin: 0;
          white-space: pre-wrap;
          word-break: break-word;
        }

        .figma-hint {
          background: #f0f9ff;
          border: 1px solid #bae6fd;
          border-radius: 8px;
          padding: 12px 16px;
          font-size: 13px;
          color: #0369a1;
          margin-bottom: 20px;
        }

        .figma-hint strong {
          font-weight: 600;
        }

        .figma-hint code {
          font-family: 'SF Mono', 'Fira Code', monospace;
          background: #e0f2fe;
          padding: 1px 5px;
          border-radius: 3px;
          font-size: 12px;
        }
      `}</style>

      <div className="figma-viewer">
        <h2 className="figma-section-title">Integração Figma</h2>
        <p className="figma-section-desc">
          Insira o fileKey de um arquivo do Figma para visualizar o preview e os dados de nodes.
        </p>

        <div className="figma-hint">
          <strong>Como obter o fileKey:</strong> Na URL do Figma,{" "}
          <code>figma.com/design/<strong>fileKey</strong>/nome-do-arquivo</code>
          {" "}— ex: <code>ik0Qa30O9oNUy3qelJbQO7</code>
        </div>

        <form className="figma-form" onSubmit={handleFetch}>
          <div className="figma-input-wrapper">
            <input
              className={`figma-input${error && !data ? " input-error" : ""}`}
              type="text"
              value={fileKey}
              onChange={(e) => {
                setFileKey(e.target.value);
                if (error) setError("");
              }}
              placeholder="Ex: ik0Qa30O9oNUy3qelJbQO7"
              aria-label="Figma fileKey"
              autoComplete="off"
              spellCheck={false}
            />
          </div>
          <button type="submit" className="figma-btn" disabled={loading}>
            {loading ? "Buscando..." : "Buscar"}
          </button>
        </form>

        {error && (
          <div className="figma-error-banner" role="alert">
            {error}
          </div>
        )}

        {loading && (
          <div className="figma-loading" role="status" aria-live="polite">
            <div className="figma-spinner" />
            Consultando MCP Figma...
          </div>
        )}

        {data && !loading && (
          <div className="figma-results">
            {/* Preview Image */}
            <div className="figma-card">
              <div className="figma-card-header">
                <div className="figma-card-icon preview">🖼️</div>
                <span className="figma-card-title">Preview do Design</span>
                <span className="figma-card-subtitle">previewUrl</span>
              </div>
              <div className="figma-card-body">
                <img
                  src={data.previewUrl}
                  alt="Figma design preview"
                  className="figma-preview-img"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                <p className="figma-preview-url">
                  URL:{" "}
                  <a href={data.previewUrl} target="_blank" rel="noopener noreferrer">
                    {data.previewUrl}
                  </a>
                </p>
              </div>
            </div>

            {/* Nodes JSON */}
            <div className="figma-card">
              <div className="figma-card-header">
                <div className="figma-card-icon nodes">🗂️</div>
                <span className="figma-card-title">Dados de Nodes (JSON)</span>
                <span className="figma-card-subtitle">nodes</span>
              </div>
              <div className="figma-card-body">
                <pre className="figma-json-pre">
                  {JSON.stringify(data.nodes, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
