import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/useAuth";
import Navbar from "../layout/Navbar";

const RepoSettings = () => {
  const { username, repoName } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [repo, setRepo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [confirmDelete, setConfirmDelete] = useState("");

  const isOwner = user?.username === username;

  useEffect(() => {
    const fetchRepo = async () => {
      try {
        const { data } = await api.get(`/repository/name/${repoName}`);
        if (data.repository?.owner?.username !== username) {
          setError("Repository not found");
          return;
        }
        setRepo(data.repository);
        setDescription(data.repository.description || "");
      } catch {
        setError("Repository not found");
      } finally {
        setLoading(false);
      }
    };
    fetchRepo();
  }, [username, repoName]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage("");
    setSaving(true);
    try {
      await api.put(`/repository/${repo._id}`, {
        description,
        content: repo.content,
      });
      setMessage("Repository updated successfully.");
    } catch {
      setMessage("Failed to update repository.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleVisibility = async () => {
    setMessage("");
    try {
      const newVis = repo.visibility === "private" ? "public" : "private";
      await api.patch(`/repository/${repo._id}/visibility`);
      setRepo((r) => ({ ...r, visibility: newVis }));
      setMessage(`Repository is now ${newVis}.`);
    } catch {
      setMessage("Failed to toggle visibility.");
    }
  };

  const handleDelete = async () => {
    if (confirmDelete !== repoName) return;
    try {
      await api.delete(`/repository/${repo._id}`);
      navigate(`/${username}`, { replace: true });
    } catch {
      setMessage("Failed to delete repository.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-github-canvas">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-github-border-default border-t-github-accent-fg" />
        </div>
      </div>
    );
  }

  if (error || !repo) {
    return (
      <div className="min-h-screen bg-github-canvas">
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 py-12 text-center">
          <p className="text-github-danger-fg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-github-canvas">
      <Navbar />
      <div className="border-b border-github-border-default bg-github-canvas-subtle">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center gap-2 pt-3 pb-0 text-sm">
            <Link to={`/${username}`} className="text-github-accent-fg hover:underline no-underline">{username}</Link>
            <span className="text-github-fg-muted">/</span>
            <Link to={`/${username}/${repoName}`} className="text-github-accent-fg font-semibold hover:underline no-underline">{repoName}</Link>
          </div>
          <nav className="flex gap-0 md:gap-2 -mb-px mt-3 overflow-x-auto">
            <Link to={`/${username}/${repoName}`} className="px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 border-transparent text-github-fg-muted hover:text-github-fg-default hover:border-github-border-default no-underline">
              Code
            </Link>
            <Link to={`/${username}/${repoName}/settings`} className="px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 border-github-attention-fg text-github-fg-default no-underline">
              Settings
            </Link>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <h2 className="text-xl font-semibold text-github-fg-default mb-6">Settings</h2>

        {message && (
          <div className={`mb-4 p-3 text-sm rounded-md border ${
            message.includes("successfully")
              ? "text-github-success-fg bg-[rgba(63,185,80,0.1)] border-[rgba(63,185,80,0.4)]"
              : "text-github-danger-fg bg-[rgba(248,81,73,0.1)] border-[rgba(248,81,73,0.4)]"
          }`}>
            {message}
          </div>
        )}

        <div className="space-y-6">
          <div className="border border-github-border-default rounded-md p-6">
            <h3 className="text-base font-semibold text-github-fg-default mb-4">General</h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label htmlFor="desc" className="block text-sm font-medium text-github-fg-default mb-1">
                  Description
                </label>
                <input
                  id="desc"
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={!isOwner}
                  className="w-full px-3 py-2 bg-github-canvas border border-github-border-default rounded-md text-github-fg-default text-sm focus:outline-none focus:border-github-accent-fg focus:ring-1 focus:ring-github-accent-fg placeholder-github-fg-subtle disabled:opacity-50"
                />
              </div>
              {isOwner && (
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-1.5 bg-github-btn-primary hover:bg-github-btn-primary-hover text-white text-sm font-semibold rounded-md border border-github-btn-primary-border cursor-pointer disabled:opacity-50 transition-colors"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              )}
            </form>
          </div>

          <div className="border border-github-border-default rounded-md p-6">
            <h3 className="text-base font-semibold text-github-fg-default mb-4">Visibility</h3>
            <p className="text-sm text-github-fg-muted mb-3">
              This repository is currently <strong className="text-github-fg-default">{repo.visibility}</strong>.
            </p>
            {isOwner && (
              <button
                onClick={handleToggleVisibility}
                className="px-4 py-1.5 bg-github-bg-tertiary hover:bg-github-canvas-subtle text-github-fg-default text-sm font-semibold rounded-md border border-github-border-default cursor-pointer transition-colors"
              >
                Make {repo.visibility === "private" ? "public" : "private"}
              </button>
            )}
          </div>

          {isOwner && (
            <div className="border border-github-danger-fg rounded-md p-6">
              <h3 className="text-base font-semibold text-github-danger-fg mb-4">Danger Zone</h3>
              <p className="text-sm text-github-fg-muted mb-3">
                Once you delete a repository, there is no going back. Please be certain.
              </p>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={confirmDelete}
                  onChange={(e) => setConfirmDelete(e.target.value)}
                  placeholder={`Type "${repoName}" to confirm`}
                  className="flex-1 px-3 py-2 bg-github-canvas border border-github-border-default rounded-md text-github-fg-default text-sm focus:outline-none focus:border-github-danger-fg focus:ring-1 focus:ring-github-danger-fg placeholder-github-fg-subtle"
                />
                <button
                  onClick={handleDelete}
                  disabled={confirmDelete !== repoName}
                  className="px-4 py-2 bg-github-danger-emphasis hover:bg-[#b62324] text-white text-sm font-semibold rounded-md border border-github-danger-emphasis cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Delete this repository
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RepoSettings;
