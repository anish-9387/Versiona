import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/axios";
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";
import type { Repository } from "../../types";

const RepoPage = () => {
  const { username, repoName } = useParams<{ username: string; repoName: string }>();
  const [repo, setRepo] = useState<Repository | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRepo = async () => {
      setLoading(true);
      setError("");
      try {
        const { data: nameData } = await api.get<{ repository: Repository }>(`/repository/name/${repoName}`);
        if (!nameData.repository) {
          setError("Repository not found");
          return;
        }
        const found = nameData.repository;
        if (found.owner?.username !== username) {
          setError("Repository not found");
          return;
        }
        const { data: idData } = await api.get<{ repository: Repository }>(`/repository/${found._id}`);
        setRepo(idData.repository || found);
      } catch {
        setError("Repository not found");
      } finally {
        setLoading(false);
      }
    };
    fetchRepo();
  }, [username, repoName]);

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
          <p className="text-github-danger-fg text-lg">{error || "Repository not found"}</p>
          <Link to="/" className="text-github-accent-fg text-sm hover:underline no-underline mt-2 inline-block">
            Go home
          </Link>
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
            <Link to={`/${username}`} className="text-github-accent-fg hover:underline no-underline">
              {username}
            </Link>
            <span className="text-github-fg-muted">/</span>
            <Link to={`/${username}/${repoName}`} className="text-github-accent-fg font-semibold hover:underline no-underline">
              {repoName}
            </Link>
            <span className={`text-xs border rounded-full px-2 py-0.5 font-medium ml-2 ${
              repo.visibility === "private"
                ? "text-github-fg-muted border-github-border-default"
                : "text-github-accent-fg border-github-accent-fg"
            }`}>
              {repo.visibility === "private" ? "Private" : "Public"}
            </span>
          </div>

          <nav className="flex gap-0 md:gap-2 -mb-px mt-3 overflow-x-auto">
            <Link
              to={`/${username}/${repoName}`}
              className="px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 border-github-attention-fg text-github-fg-default no-underline flex items-center gap-2"
            >
              <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" className="fill-current">
                <path d="M2 1.75C2 .784 2.784 0 3.75 0h8.5C13.216 0 14 .784 14 1.75v12.5A1.75 1.75 0 0112.25 16h-8.5A1.75 1.75 0 012 14.25V1.75zM3.75 1.5a.25.25 0 00-.25.25v12.5c0 .138.112.25.25.25h8.5a.25.25 0 00.25-.25V1.75a.25.25 0 00-.25-.25h-8.5z" />
                <path d="M5.5 4.25a.75.75 0 01.75-.75h3.5a.75.75 0 010 1.5h-3.5a.75.75 0 01-.75-.75zm0 3a.75.75 0 01.75-.75h3.5a.75.75 0 010 1.5h-3.5a.75.75 0 01-.75-.75zm0 3a.75.75 0 01.75-.75h.5a.75.75 0 010 1.5h-.5a.75.75 0 01-.75-.75z" />
              </svg>
              Code
            </Link>
            <Link
              to={`/${username}/${repoName}/issues`}
              className="px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 border-transparent text-github-fg-muted hover:text-github-fg-default hover:border-github-border-default no-underline flex items-center gap-2"
            >
              <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" className="fill-current">
                <path d="M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                <path d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z" />
              </svg>
              Issues{" "}
              {repo.issues && repo.issues.length > 0 && (
                <span className="text-xs text-github-fg-muted font-normal">({repo.issues.length})</span>
              )}
            </Link>
            <Link
              to={`/${username}/${repoName}/settings`}
              className="px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 border-transparent text-github-fg-muted hover:text-github-fg-default hover:border-github-border-default no-underline flex items-center gap-2"
            >
              <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" className="fill-current">
                <path d="M8 4.754a3.246 3.246 0 100 6.492 3.246 3.246 0 000-6.492zM5.754 8a2.246 2.246 0 114.492 0 2.246 2.246 0 01-4.492 0z" />
                <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 01-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 01-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 01.52 1.255l-.16.292c-.892 1.64.902 3.433 2.541 2.54l.292-.159a.873.873 0 011.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 011.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 01.52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 01-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 01-1.255-.52l-.094-.319z" />
              </svg>
              Settings
            </Link>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0">
            <div className="border border-github-border-default rounded-md overflow-hidden">
              <div className="bg-github-canvas-subtle border-b border-github-border-default px-4 py-2 flex items-center justify-between text-xs text-github-fg-muted">
                <span className="font-semibold text-github-fg-default">
                  {repo.content && repo.content.length > 0 ? `${repo.content.length} files` : "Files"}
                </span>
                <div className="flex items-center gap-2">
                  <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" className="fill-github-fg-muted">
                    <path d="M1.75 1A1.75 1.75 0 000 2.75v10.5C0 14.216.784 15 1.75 15h12.5A1.75 1.75 0 0016 13.25v-8.5A1.75 1.75 0 0014.25 3H7.5l-1.28-1.28A1.75 1.75 0 005.19 1H1.75zM1.5 2.75c0-.138.112-.25.25-.25h3.44c.139 0 .272.055.37.153L6.47 4.03a.75.75 0 00.53.22h7.25c.138 0 .25.112.25.25v8.5c0 .138-.112.25-.25.25H1.75a.25.25 0 01-.25-.25V2.75z" />
                  </svg>
                  <span>{repoName}</span>
                </div>
              </div>

              {repo.content && repo.content.length > 0 ? (
                <div className="divide-y divide-github-border-default">
                  {repo.content.map((file, idx) => {
                    const isFile = !file.endsWith("/");
                    return (
                      <div key={idx} className="flex items-center gap-3 px-4 py-2.5 hover:bg-github-canvas-subtle text-sm">
                        <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16"
                          className={isFile ? "fill-github-fg-muted" : "fill-github-accent-fg"}
                        >
                          {isFile ? (
                            <path d="M2 1.75C2 .784 2.784 0 3.75 0h6.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0113.25 16h-9.5A1.75 1.75 0 012 14.25V1.75zM3.75 1.5a.25.25 0 00-.25.25v12.5c0 .138.112.25.25.25h9.5a.25.25 0 00.25-.25V5.5h-3.25A1.75 1.75 0 018.5 3.75V1.5H3.75z" />
                          ) : (
                            <path d="M1.75 1A1.75 1.75 0 000 2.75v10.5C0 14.216.784 15 1.75 15h12.5A1.75 1.75 0 0016 13.25v-8.5A1.75 1.75 0 0014.25 3H7.5l-1.28-1.28A1.75 1.75 0 005.19 1H1.75z" />
                          )}
                        </svg>
                        <span className={isFile ? "text-github-fg-default" : "text-github-accent-fg"}>
                          {file}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="px-4 py-8 text-center">
                  <svg aria-hidden="true" height="48" viewBox="0 0 16 16" version="1.1" width="48" className="fill-github-fg-muted mx-auto mb-3">
                    <path d="M2 1.75C2 .784 2.784 0 3.75 0h6.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0113.25 16h-9.5A1.75 1.75 0 012 14.25V1.75zM3.75 1.5a.25.25 0 00-.25.25v12.5c0 .138.112.25.25.25h9.5a.25.25 0 00.25-.25V5.5h-3.25A1.75 1.75 0 018.5 3.75V1.5H3.75z" />
                  </svg>
                  <p className="text-github-fg-default text-sm font-medium mb-1">No files in this repository</p>
                  <p className="text-github-fg-muted text-xs">
                    Create a new file or upload one to get started.
                  </p>
                </div>
              )}
            </div>

            {repo.description && (
              <div className="mt-6 border border-github-border-default rounded-md p-6">
                <div className="flex items-center gap-2 mb-3">
                  <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" className="fill-github-fg-muted">
                    <path d="M0 8a8 8 0 1116 0A8 8 0 010 8zm8-6.5a6.5 6.5 0 110 13 6.5 6.5 0 010-13zM6.5 7.75A.75.75 0 017.25 7h1a.75.75 0 01.75.75v2.75h.25a.75.75 0 010 1.5h-2.5a.75.75 0 010-1.5h.25v-2h-.25a.75.75 0 01-.75-.75zM8 6a1 1 0 100-2 1 1 0 000 2z" />
                  </svg>
                  <h3 className="text-sm font-semibold text-github-fg-default">README</h3>
                </div>
                <p className="text-sm text-github-fg-muted">{repo.description}</p>
              </div>
            )}
          </div>

          <aside className="w-full lg:w-72 shrink-0">
            <div className="border border-github-border-default rounded-md p-4">
              <h3 className="text-xs font-semibold text-github-fg-muted uppercase tracking-wider mb-3">About</h3>
              {repo.description && (
                <p className="text-sm text-github-fg-muted mb-3">{repo.description}</p>
              )}
              <div className="space-y-2 text-sm text-github-fg-muted">
                <div className="flex items-center gap-2">
                  <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" className="fill-github-fg-muted shrink-0">
                    <path d="M1 1.75A.75.75 0 011.75 1h4.253c.379 0 .725.214.895.56l1.02 2.09h4.382A.75.75 0 0113 4.5v.75h-2.5a.75.75 0 010-1.5H7.5c-.198 0-.38.078-.51.21l-.815.79H2.5v7.5h6.25a.75.75 0 010 1.5H1.75a.75.75 0 01-.75-.75V1.75z" />
                    <path d="M16 11.5a.75.75 0 01-.75.75h-1.75v1.75a.75.75 0 01-1.5 0V12.25h-1.75a.75.75 0 010-1.5h1.75V9a.75.75 0 011.5 0v1.75h1.75a.75.75 0 01.75.75z" />
                  </svg>
                  <Link to="/new" className="text-github-accent-fg hover:underline no-underline">
                    Suggest a topic
                  </Link>
                </div>
                <div className="flex items-center gap-2">
                  <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" className="fill-github-fg-muted shrink-0">
                    <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 010-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z" />
                  </svg>
                  <Link to={`/${username}/${repoName}/issues`} className="text-github-accent-fg hover:underline no-underline">
                    Issues
                  </Link>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-github-border-default">
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-github-accent-emphasis" />
                  <span className="text-xs text-github-fg-muted">JavaScript</span>
                </div>
              </div>
            </div>

            <div className="mt-4 border border-github-border-default rounded-md p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-semibold text-github-fg-muted uppercase tracking-wider">
                  {repo.issues?.length || 0} Open issues
                </h3>
                <Link
                  to={`/${username}/${repoName}/issues/new`}
                  className="text-xs text-github-accent-fg hover:underline no-underline font-semibold"
                >
                  New issue
                </Link>
              </div>
              {repo.issues && repo.issues.length > 0 ? (
                <div className="space-y-2">
                  {repo.issues.slice(0, 5).map((issue) => (
                    <Link
                      key={issue._id}
                      to={`/${username}/${repoName}/issues/${issue._id}`}
                      className="flex items-start gap-2 text-sm no-underline group"
                    >
                      <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16"
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
                      <span className="text-github-fg-default group-hover:text-github-accent-fg">
                        {issue.title}
                      </span>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-github-fg-muted">No open issues yet.</p>
              )}
            </div>
          </aside>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RepoPage;
