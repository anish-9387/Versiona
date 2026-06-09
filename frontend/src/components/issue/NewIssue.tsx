import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";
import Navbar from "../layout/Navbar";
import type { Repository, Issue } from "../../types";

const NewIssue = () => {
  const { username, repoName } = useParams<{ username: string; repoName: string }>();
  const navigate = useNavigate();
  const [repo, setRepo] = useState<Repository | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchRepo = async () => {
      try {
        const { data } = await api.get(`/repository/name/${repoName}`);
        if (data.repository?.owner?.username !== username) {
          setError("Repository not found");
          return;
        }
        setRepo(data.repository);
      } catch {
        setError("Repository not found");
      } finally {
        setLoading(false);
      }
    };
    fetchRepo();
  }, [username, repoName]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!title.trim()) {
      setError("Issue title is required.");
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await api.post<{ issue: Issue }>(`/issue/create/${repo!._id}`, {
        title: title.trim(),
        description: description.trim() || "No description provided.",
      });
      navigate(`/${username}/${repoName}/issues/${data.issue._id}`);
    } catch {
      setError("Failed to create issue.");
    } finally {
      setSubmitting(false);
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

  if (error && !repo) {
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
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-8">
        <div className="mb-4">
          <Link to={`/${username}/${repoName}/issues`} className="text-github-accent-fg text-sm hover:underline no-underline">
            &larr; Back to issues
          </Link>
        </div>

        <div className="border border-github-border-default rounded-md p-6">
          <div className="flex items-center gap-2 text-sm text-github-fg-muted mb-6">
            <Link to={`/${username}`} className="text-github-accent-fg hover:underline no-underline">{username}</Link>
            <span>/</span>
            <Link to={`/${username}/${repoName}`} className="text-github-accent-fg hover:underline no-underline">{repoName}</Link>
          </div>

          <h1 className="text-xl font-semibold text-github-fg-default mb-6">New Issue</h1>

          {error && (
            <div className="mb-4 p-3 text-sm text-github-danger-fg bg-[rgba(248,81,73,0.1)] border border-[rgba(248,81,73,0.4)] rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Issue title"
                className="w-full px-3 py-2 bg-github-canvas border border-github-border-default rounded-md text-github-fg-default text-base font-medium focus:outline-none focus:border-github-accent-fg focus:ring-1 focus:ring-github-accent-fg placeholder-github-fg-subtle"
              />
            </div>
            <div>
              <textarea
                rows={10}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Leave a comment or description..."
                className="w-full px-3 py-2 bg-github-canvas border border-github-border-default rounded-md text-github-fg-default text-sm focus:outline-none focus:border-github-accent-fg focus:ring-1 focus:ring-github-accent-fg placeholder-github-fg-subtle resize-y"
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={submitting || !title.trim()}
                className="px-4 py-1.5 bg-github-btn-primary hover:bg-github-btn-primary-hover text-white text-sm font-semibold rounded-md border border-github-btn-primary-border cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? "Submitting..." : "Submit new issue"}
              </button>
              <Link
                to={`/${username}/${repoName}/issues`}
                className="px-4 py-1.5 bg-github-bg-tertiary hover:bg-github-canvas-subtle text-github-fg-default text-sm font-semibold rounded-md border border-github-border-default no-underline transition-colors"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewIssue;
