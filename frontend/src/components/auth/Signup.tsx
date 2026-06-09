import { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/useAuth";
import type { AxiosError } from "axios";

interface SignupResponse {
  token: string;
  userId: string;
}

const Signup = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  if (user) return <Navigate to="/" replace />;

  const update = (field: "username" | "email" | "password") => (e: ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    const { username, email, password } = form;
    if (!username || !email || !password) {
      setError("All fields are required.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    try {
      setLoading(true);
      const { data } = await api.post<SignupResponse>("/user/signup", form);
      login(data.token, data.userId);
      navigate("/", { replace: true });
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      setError(axiosErr.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-github-canvas flex flex-col items-center justify-center px-4 py-8">
      <Link to="/" className="mb-6">
        <img src="/logo.png" alt="Versiona" className="h-12 w-12 rounded-full" />
      </Link>

      <div className="w-full max-w-77">
        <div className="bg-github-canvas-subtle border border-github-border-default rounded-md p-4">
          <h1 className="text-github-fg-default text-2xl text-center mb-4 font-light">Create your account</h1>

          {error && (
            <div className="mb-3 p-2.5 text-sm text-github-danger-fg bg-[rgba(248,81,73,0.1)] border border-[rgba(248,81,73,0.4)] rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label htmlFor="username" className="block text-github-fg-default text-sm font-medium mb-1">
                Username
              </label>
              <input
                id="username"
                autoComplete="username"
                className="w-full px-3 py-2 bg-github-canvas border border-github-border-default rounded-md text-github-fg-default text-sm focus:outline-none focus:border-github-accent-fg focus:ring-1 focus:ring-github-accent-fg placeholder-github-fg-subtle"
                type="text"
                value={form.username}
                onChange={update("username")}
                placeholder="Choose a username"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-github-fg-default text-sm font-medium mb-1">
                Email address
              </label>
              <input
                id="email"
                autoComplete="email"
                className="w-full px-3 py-2 bg-github-canvas border border-github-border-default rounded-md text-github-fg-default text-sm focus:outline-none focus:border-github-accent-fg focus:ring-1 focus:ring-github-accent-fg placeholder-github-fg-subtle"
                type="email"
                value={form.email}
                onChange={update("email")}
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-github-fg-default text-sm font-medium mb-1">
                Password
              </label>
              <input
                id="password"
                autoComplete="new-password"
                className="w-full px-3 py-2 bg-github-canvas border border-github-border-default rounded-md text-github-fg-default text-sm focus:outline-none focus:border-github-accent-fg focus:ring-1 focus:ring-github-accent-fg placeholder-github-fg-subtle"
                type="password"
                value={form.password}
                onChange={update("password")}
                placeholder="At least 6 characters"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-github-btn-primary hover:bg-github-btn-primary-hover text-white text-sm font-semibold rounded-md border border-github-btn-primary-border cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>
        </div>

        <div className="mt-4 border border-github-border-default rounded-md p-4 text-center">
          <p className="text-github-fg-muted text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-github-accent-fg no-underline hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        <p className="mt-8 text-center text-xs text-github-fg-muted">
          By creating an account, you agree to the{" "}
          <Link to="#" className="hover:text-github-accent-fg no-underline">Terms of Service</Link>
          {" "}and{" "}
          <Link to="#" className="hover:text-github-accent-fg no-underline">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
};

export default Signup;
