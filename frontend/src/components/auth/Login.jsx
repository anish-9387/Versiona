import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/useAuth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }
    try {
      setLoading(true);
      const { data } = await api.post("/user/login", { email, password });
      login(data.token, data.userId);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Incorrect email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-github-canvas flex flex-col items-center justify-center px-4 py-8">
      <Link to="/" className="mb-6">
        <svg aria-hidden="true" height="48" viewBox="0 0 16 16" version="1.1" width="48" className="fill-white">
          <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.87-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" />
        </svg>
      </Link>

      <div className="w-full max-w-77">
        <div className="bg-github-canvas-subtle border border-github-border-default rounded-md p-4">
          <h1 className="text-github-fg-default text-2xl text-center mb-4 font-light">Sign in to Versiona</h1>

          {error && (
            <div className="mb-3 p-2.5 text-sm text-github-danger-fg bg-[rgba(248,81,73,0.1)] border border-[rgba(248,81,73,0.4)] rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label htmlFor="login" className="block text-github-fg-default text-sm font-medium mb-1">
                Email address
              </label>
              <input
                id="login"
                autoComplete="username"
                className="w-full px-3 py-2 bg-github-canvas border border-github-border-default rounded-md text-github-fg-default text-sm focus:outline-none focus:border-github-accent-fg focus:ring-1 focus:ring-github-accent-fg placeholder-github-fg-subtle"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="block text-github-fg-default text-sm font-medium">
                  Password
                </label>
                <Link to="#" className="text-xs text-github-accent-fg no-underline hover:underline">
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                autoComplete="current-password"
                className="w-full px-3 py-2 bg-github-canvas border border-github-border-default rounded-md text-github-fg-default text-sm focus:outline-none focus:border-github-accent-fg focus:ring-1 focus:ring-github-accent-fg placeholder-github-fg-subtle"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-github-btn-primary hover:bg-github-btn-primary-hover text-white text-sm font-semibold rounded-md border border-github-btn-primary-border cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>

        <div className="mt-4 border border-github-border-default rounded-md p-4 text-center">
          <p className="text-github-fg-muted text-sm">
            New to Versiona?{" "}
            <Link to="/signup" className="text-github-accent-fg no-underline hover:underline">
              Create an account
            </Link>
          </p>
        </div>

        <p className="mt-8 text-center text-xs text-github-fg-muted">
          <Link to="#" className="hover:text-github-accent-fg no-underline">Terms</Link>
          {" "}&middot;{" "}
          <Link to="#" className="hover:text-github-accent-fg no-underline">Privacy</Link>
          {" "}&middot;{" "}
          <Link to="#" className="hover:text-github-accent-fg no-underline">Security</Link>
          {" "}&middot;{" "}
          <Link to="https://github.com/anish-9387/Versiona" className="hover:text-github-accent-fg no-underline">Contact Versiona</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
