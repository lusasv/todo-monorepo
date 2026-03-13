import React, { useState } from "react";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";

interface LoginFormProps {
  onAuthSuccess: (token: string, user: { id: number; email: string; name: string | null }) => void;
}

function mapBackendError(errorValue: string): string {
  switch (errorValue) {
    case "user not found":
      return "No account found with this email";
    case "invalid password":
      return "Incorrect password";
    case "email already exists":
      return "An account with this email already exists";
    case "email and password are required":
      return "Email and password are required";
    default:
      return "Authentication failed. Please try again.";
  }
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function LoginForm({ onAuthSuccess }: LoginFormProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  function validateForm(): boolean {
    let valid = true;
    if (!email) {
      setEmailError("Email is required");
      valid = false;
    } else if (!isValidEmail(email)) {
      setEmailError("Enter a valid email address");
      valid = false;
    } else {
      setEmailError("");
    }
    if (!password) {
      setPasswordError("Password is required");
      valid = false;
    } else {
      setPasswordError("");
    }
    return valid;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!validateForm()) return;

    setLoading(true);
    try {
      const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
      const data = isRegister ? { email, password, name } : { email, password };
      const res = await axios.post(endpoint, data);
      localStorage.setItem("token", res.data.token);
      onAuthSuccess(res.data.token, res.data.user);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const backendError = err.response?.data?.error ?? "";
        setError(mapBackendError(backendError));
      } else {
        setError("Authentication failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  function switchMode() {
    setIsRegister((prev) => !prev);
    setError("");
    setEmailError("");
    setPasswordError("");
    setEmail("");
    setPassword("");
    setName("");
  }

  return (
    <>
      <style>{`
        *,
        *::before,
        *::after {
          box-sizing: border-box;
        }

        .auth-wrapper {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 16px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, sans-serif;
        }

        .auth-card {
          background: #ffffff;
          border-radius: 12px;
          padding: 40px;
          width: 100%;
          max-width: 400px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
        }

        .auth-title {
          font-size: 28px;
          font-weight: 700;
          color: #1a1a2e;
          text-align: center;
          margin: 0 0 8px;
        }

        .auth-subtitle {
          font-size: 14px;
          color: #6b7280;
          text-align: center;
          margin: 0 0 32px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 6px;
        }

        .form-input {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 15px;
          color: #1f2937;
          background: #f9fafb;
          transition: border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
          outline: none;
        }

        .form-input:focus {
          border-color: #667eea;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15);
        }

        .form-input.input-error {
          border-color: #ef4444;
          background: #fff5f5;
        }

        .form-input.input-error:focus {
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
        }

        .password-wrapper {
          position: relative;
        }

        .password-wrapper .form-input {
          padding-right: 48px;
        }

        .password-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #9ca3af;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          transition: color 0.2s ease;
        }

        .password-toggle:hover {
          color: #667eea;
        }

        .password-toggle:focus-visible {
          outline: 2px solid #667eea;
          outline-offset: 2px;
        }

        .field-error {
          font-size: 13px;
          color: #ef4444;
          margin-top: 6px;
        }

        .form-error-banner {
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 8px;
          padding: 12px 16px;
          margin-bottom: 20px;
          font-size: 14px;
          color: #b91c1c;
        }

        .submit-btn {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #ffffff;
          font-size: 16px;
          font-weight: 600;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: opacity 0.2s ease, transform 0.1s ease, box-shadow 0.2s ease;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
          margin-top: 8px;
        }

        .submit-btn:hover:not(:disabled) {
          opacity: 0.92;
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
          transform: translateY(-1px);
        }

        .submit-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .submit-btn:disabled {
          opacity: 0.55;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .switch-mode {
          margin-top: 24px;
          text-align: center;
          font-size: 14px;
          color: #6b7280;
        }

        .switch-mode-btn {
          background: none;
          border: none;
          color: #667eea;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          padding: 0;
          text-decoration: underline;
          transition: color 0.2s ease;
        }

        .switch-mode-btn:hover {
          color: #764ba2;
        }

        .switch-mode-btn:focus-visible {
          outline: 2px solid #667eea;
          outline-offset: 2px;
          border-radius: 2px;
        }

        @media (max-width: 767px) {
          .auth-wrapper {
            align-items: flex-start;
            padding: 16px;
          }

          .auth-card {
            box-shadow: none;
            border-radius: 8px;
            padding: 28px 16px;
            max-width: 100%;
          }
        }

        @media (min-width: 768px) and (max-width: 1023px) {
          .auth-card {
            max-width: 420px;
          }
        }

        @media (min-width: 1024px) {
          .auth-card {
            max-width: 400px;
          }
        }
      `}</style>

      <div className="auth-wrapper">
        <div className="auth-card">
          <h2 className="auth-title">
            {isRegister ? "Criar Conta" : "Login"}
          </h2>
          <p className="auth-subtitle">
            {isRegister
              ? "Preencha os dados abaixo para se cadastrar"
              : "Entre com seu email e senha"}
          </p>

          <form onSubmit={handleSubmit} noValidate>
            {isRegister && (
              <div className="form-group">
                <label className="form-label" htmlFor="name">
                  Nome
                </label>
                <input
                  id="name"
                  className="form-input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                  autoComplete="name"
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                className={`form-input${emailError ? " input-error" : ""}`}
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError("");
                }}
                placeholder="voce@exemplo.com"
                autoComplete="email"
                aria-describedby={emailError ? "email-error" : undefined}
                aria-invalid={!!emailError}
              />
              {emailError && (
                <p id="email-error" className="field-error" role="alert">
                  {emailError}
                </p>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">
                Senha
              </label>
              <div className="password-wrapper">
                <input
                  id="password"
                  className={`form-input${passwordError ? " input-error" : ""}`}
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) setPasswordError("");
                  }}
                  placeholder="Sua senha"
                  autoComplete={isRegister ? "new-password" : "current-password"}
                  aria-describedby={passwordError ? "password-error" : undefined}
                  aria-invalid={!!passwordError}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {passwordError && (
                <p id="password-error" className="field-error" role="alert">
                  {passwordError}
                </p>
              )}
            </div>

            {error && (
              <div className="form-error-banner" role="alert">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              {loading
                ? isRegister
                  ? "Cadastrando..."
                  : "Entrando..."
                : isRegister
                  ? "Cadastrar"
                  : "Entrar"}
            </button>
          </form>

          <p className="switch-mode">
            {isRegister ? "Ja tem conta? " : "Nao tem conta? "}
            <button
              className="switch-mode-btn"
              onClick={switchMode}
            >
              {isRegister ? "Entrar" : "Cadastrar"}
            </button>
          </p>
        </div>
      </div>
    </>
  );
}
