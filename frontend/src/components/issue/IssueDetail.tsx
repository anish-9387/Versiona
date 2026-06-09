import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/useAuth";
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";
import type { Issue } from "../../types";

interface IssueResponse {
  issue: Issue;
}

const IssueDetail = () => {
  const { username, repoName, issueId } = useParams<{ username: string; repoName: string; issueId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: repoData } = await api.get(`/repository/name/${repoName}`);
        if (repoData.repository?.owner?.username !== username) {
          setError("Not found");
          return;
        }
        const { data: issueData } = await api.get<IssueResponse>(`/issue/${issueId}`);
        if (!issueData.issue) {
          setError("Issue not found");
          return;
        }
        setIssue(issueData.issue);
        setEditTitle(issueData.issue.title);
        setEditDesc(issueData.issue.description);
      } catch {
        setError("Failed to load issue");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [username, repoName, issueId]);

  const handleStatusToggle = async () => {
    if (!issue) return;
    try {
      const newStatus = issue.status === "open" ? "closed" : "open";
      const { data } = await api.put<IssueResponse>(`/issue/${issue._id}`, {
        title: issue.title,
        description: issue.description,
        status: newStatus,
      });
      setIssue(data.issue);
    } catch {
      alert("Failed to update issue status.");
    }
  };

  const handleEdit = async (e: FormEvent) => {
    e.preventDefault();
    if (!issue) return;
    setSaving(true);
    try {
      const { data } = await api.put<IssueResponse>(`/issue/${issue._id}`, {
        title: editTitle,
        description: editDesc,
        status: issue.status,
      });
      setIssue(data.issue);
      setEditing(false);
    } catch {
      alert("Failed to update issue.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!issue) return;
    if (!confirm("Are you sure you want to delete this issue?")) return;
    try {
      await api.delete(`/issue/${issue._id}`);
      navigate(`/${username}/${repoName}/issues`);
    } catch {
      alert("Failed to delete issue.");
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

  if (error || !issue) {
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
            <Link to={`/${username}/${repoName}/issues`} className="px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 border-github-attention-fg text-github-fg-default no-underline flex items-center gap-2">
              <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" className="fill-current">
                <path d="M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                <path d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z" />
              </svg>
              Issues
            </Link>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        <div className="mb-4">
          <Link to={`/${username}/${repoName}/issues`} className="text-github-accent-fg text-sm hover:underline no-underline">
            &larr; Back to issues
          </Link>
        </div>

        {editing ? (
          <form onSubmit={handleEdit} className="border border-github-border-default rounded-md p-6">
            <h2 className="text-lg font-semibold text-github-fg-default mb-4">Edit Issue</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-github-fg-default mb-1">Title</label>
                <input
                  id="title"
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-github-canvas border border-github-border-default rounded-md text-github-fg-default text-sm focus:outline-none focus:border-github-accent-fg focus:ring-1 focus:ring-github-accent-fg"
                />
              </div>
              <div>
                <label htmlFor="desc" className="block text-sm font-medium text-github-fg-default mb-1">Description</label>
                <textarea
                  id="desc"
                  rows={5}
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-github-canvas border border-github-border-default rounded-md text-github-fg-default text-sm focus:outline-none focus:border-github-accent-fg focus:ring-1 focus:ring-github-accent-fg resize-y"
                />
              </div>
              <div className="flex items-center gap-3">
                <button type="submit" disabled={saving}
                  className="px-4 py-1.5 bg-github-btn-primary hover:bg-github-btn-primary-hover text-white text-sm font-semibold rounded-md border border-github-btn-primary-border cursor-pointer disabled:opacity-50 transition-colors"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
                <button type="button" onClick={() => setEditing(false)}
                  className="px-4 py-1.5 bg-github-bg-tertiary hover:bg-github-canvas-subtle text-github-fg-default text-sm font-semibold rounded-md border border-github-border-default cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="border border-github-border-default rounded-md">
            <div className="p-6 border-b border-github-border-default">
              <div className="flex items-start gap-3 mb-2">
                <svg aria-hidden="true" height="24" viewBox="0 0 16 16" version="1.1" width="24"
                  className={`shrink-0 mt-0.5 fill-current ${
                    issue.status === "open" ? "text-github-success-fg" : "text-github-danger-fg"
                  }`}
                >
                  {issue.status === "open" ? (
                    <path d="M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                  ) : (
                    <path d="M11.28 6.78a.75.75 0 00-1.06-1.06L7.25 8.69 5.78 7.22a.75.75 0 00-1.06 1.06l2 2a.75.75 0 001.06 0l3.5-3.5z" />
                  )}
                  <path d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z" />
                </svg>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-semibold text-github-fg-default mb-1">{issue.title}</h2>
                  <div className="flex items-center gap-2 text-sm text-github-fg-muted">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                      issue.status === "open"
                        ? "text-github-success-fg border-github-success-fg bg-[rgba(63,185,80,0.1)]"
                        : "text-github-danger-fg border-github-danger-fg bg-[rgba(248,81,73,0.1)]"
                    }`}>
                      {issue.status === "open" ? "Open" : "Closed"}
                    </span>
                    <span>#{issue._id?.slice(-6)}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-github-bg-tertiary border border-github-border-default flex items-center justify-center text-sm font-semibold text-github-fg-default shrink-0">
                  ?
                </div>
                <div className="flex-1 min-w-0">
                  <div className="border border-github-border-default rounded-md overflow-hidden">
                    <div className="bg-github-canvas-subtle px-4 py-2 border-b border-github-border-default text-sm text-github-fg-muted">
                      <strong className="text-github-fg-default">Unknown</strong> opened this issue
                    </div>
                    <div className="p-4 text-sm text-github-fg-default">
                      {issue.description}
                    </div>
                  </div>

                  {user && (
                    <div className="flex items-center gap-3 mt-4">
                      <button
                        onClick={handleStatusToggle}
                        className="px-4 py-1.5 bg-github-bg-tertiary hover:bg-github-canvas-subtle text-github-fg-default text-sm font-semibold rounded-md border border-github-border-default cursor-pointer transition-colors"
                      >
                        {issue.status === "open" ? "Close issue" : "Reopen issue"}
                      </button>
                      <button
                        onClick={() => setEditing(true)}
                        className="px-4 py-1.5 bg-github-bg-tertiary hover:bg-github-canvas-subtle text-github-fg-default text-sm font-semibold rounded-md border border-github-border-default cursor-pointer transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={handleDelete}
                        className="px-4 py-1.5 bg-github-danger-emphasis hover:bg-[#b62324] text-white text-sm font-semibold rounded-md border border-github-danger-emphasis cursor-pointer transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default IssueDetail;
