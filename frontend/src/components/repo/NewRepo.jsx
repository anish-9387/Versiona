import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/useAuth";
import Navbar from "../layout/Navbar";

const NewRepo = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    description: "",
    visibility: "private",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setError("Repository name is required.");
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.post("/repository/create", {
        owner: user._id,
        name: form.name.trim(),
        description: form.description.trim(),
        visibility: form.visibility,
      });

      navigate(`/${user.username}/${data.repository.name}`);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to create repository."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-github-canvas">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-8">
        <div className="mb-6">
          <Link to="/" className="text-github-accent-fg text-sm hover:underline no-underline">
            &larr; Back
          </Link>
        </div>

        <div className="border border-github-border-default rounded-md p-6 md:p-8">
          <h1 className="text-2xl font-semibold text-github-fg-default mb-1">
            Create a new repository
          </h1>
          <p className="text-sm text-github-fg-muted mb-6">
            A repository contains all of your project's files and revision history.
          </p>

          {error && (
            <div className="mb-4 p-3 text-sm text-github-danger-fg bg-[rgba(248,81,73,0.1)] border border-[rgba(248,81,73,0.4)] rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-github-fg-default mb-1">
                Owner <span className="text-github-danger-fg">*</span>
              </label>
              <div className="flex items-center gap-2 p-2.5 border border-github-border-default rounded-md bg-github-canvas text-sm text-github-fg-default">
                <div className="w-5 h-5 rounded-full bg-github-bg-tertiary flex items-center justify-center text-xs font-semibold text-github-fg-default">
                  {user?.username?.[0]?.toUpperCase() || "?"}
                </div>
                <span className="text-github-fg-muted">{user?.username}</span>
                <span className="text-github-fg-muted">/</span>
                <input
                  type="text"
                  value={form.name}
                  onChange={update("name")}
                  placeholder="repository-name"
                  className="flex-1 bg-transparent border-none outline-none text-github-accent-fg font-semibold placeholder-github-fg-subtle"
                />
              </div>
            </div>

            <div>
              <label htmlFor="desc" className="block text-sm font-medium text-github-fg-default mb-1">
                Description <span className="text-github-fg-muted font-normal">(optional)</span>
              </label>
              <input
                id="desc"
                type="text"
                value={form.description}
                onChange={update("description")}
                placeholder="A short description of your repository..."
                className="w-full px-3 py-2 bg-github-canvas border border-github-border-default rounded-md text-github-fg-default text-sm focus:outline-none focus:border-github-accent-fg focus:ring-1 focus:ring-github-accent-fg placeholder-github-fg-subtle"
              />
            </div>

            <div>
              <h3 className="text-sm font-medium text-github-fg-default mb-2">
                Visibility
              </h3>
              <div className="space-y-3">
                <label className="flex items-start gap-3 p-3 border border-github-border-default rounded-md cursor-pointer hover:bg-github-canvas-subtle">
                  <input
                    type="radio"
                    name="visibility"
                    checked={form.visibility === "public"}
                    onChange={() => setForm((f) => ({ ...f, visibility: "public" }))}
                    className="mt-0.5 accent-github-accent-emphasis"
                  />
                  <div>
                    <div className="flex items-center gap-2 text-sm font-medium text-github-fg-default">
                      <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" className="fill-github-fg-muted">
                        <path d="M8 2c-3.5 0-5.5 2.5-6 3 1 2 3 6 6 6s5-4 6-6c-.5-.5-2.5-3-6-3zm0 8c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm0-3c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z" />
                      </svg>
                      Public
                    </div>
                    <p className="text-xs text-github-fg-muted mt-0.5">
                      Anyone on the internet can see this repository.
                    </p>
                  </div>
                </label>
                <label className="flex items-start gap-3 p-3 border border-github-border-default rounded-md cursor-pointer hover:bg-github-canvas-subtle">
                  <input
                    type="radio"
                    name="visibility"
                    checked={form.visibility === "private"}
                    onChange={() => setForm((f) => ({ ...f, visibility: "private" }))}
                    className="mt-0.5 accent-github-accent-emphasis"
                  />
                  <div>
                    <div className="flex items-center gap-2 text-sm font-medium text-github-fg-default">
                      <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" className="fill-github-fg-muted">
                        <path d="M4 5.5C4 3.01 5.5 1 8 1s4 2.01 4 4.5v.5h1.25c.966 0 1.75.784 1.75 1.75v5.5A1.75 1.75 0 0113.25 15H2.75A1.75 1.75 0 011 13.25v-5.5C1 6.784 1.784 6 2.75 6H4v-.5zM8 2.5c-1.5 0-2.5 1.21-2.5 3v.5h5v-.5c0-1.79-1-3-2.5-3zm-5.5 4v6.75c0 .138.112.25.25.25h10.5a.25.25 0 00.25-.25V6.5h-11z" />
                      </svg>
                      Private
                    </div>
                    <p className="text-xs text-github-fg-muted mt-0.5">
                      You choose who can see and commit to this repository.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-github-border-default">
              <button
                type="submit"
                disabled={loading || !form.name.trim()}
                className="px-6 py-2 bg-github-btn-primary hover:bg-github-btn-primary-hover text-white text-sm font-semibold rounded-md border border-github-btn-primary-border cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Creating..." : "Create repository"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewRepo;
