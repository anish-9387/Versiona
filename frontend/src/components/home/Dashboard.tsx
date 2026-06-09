import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import api from "../../api/axios";
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";
import type { Repository } from "../../types";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [repos, setRepos] = useState<Repository[]>([]);
  const [allRepos, setAllRepos] = useState<Repository[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      try {
        const [userReposRes, allReposRes] = await Promise.all([
          api.get<{ repositories: Repository[] }>(`/repository/user/${user._id}`),
          api.get<{ repositories: Repository[] }>(`/repository/all`),
        ]);
        setRepos(Array.isArray(userReposRes.data.repositories) ? userReposRes.data.repositories : []);
        setAllRepos(Array.isArray(allReposRes.data.repositories) ? allReposRes.data.repositories : []);
      } catch {
        setRepos([]);
        setAllRepos([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const filtered = repos.filter((r) =>
    r.name?.toLowerCase().includes(search.toLowerCase())
  );

  if (!user) return null;

  return (
    <div className="min-h-screen bg-github-canvas flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-72 shrink-0">
            <div className="flex items-center gap-3 mb-6">
              <Link to={`/${user.username}`}>
                <div className="w-8 h-8 rounded-full bg-github-bg-tertiary border border-github-border-default flex items-center justify-center text-sm font-semibold text-github-fg-default overflow-hidden shrink-0">
                  {user.username?.[0]?.toUpperCase() || "?"}
                </div>
              </Link>
              <div>
                <Link to={`/${user.username}`} className="text-sm font-semibold text-github-fg-default no-underline hover:text-github-accent-fg">
                  {user.username}
                </Link>
                <p className="text-xs text-github-fg-muted">{user.email}</p>
              </div>
            </div>

            <div className="space-y-1 mb-6">
              <Link to="/" className="flex items-center gap-3 px-2 py-1.5 text-sm text-github-fg-default bg-github-bg-tertiary rounded-md no-underline font-semibold">
                <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" className="fill-github-fg-muted shrink-0">
                  <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 010-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z" />
                </svg>
                <span>Repositories</span>
              </Link>
            </div>

            <div className="mb-4">
              <h3 className="text-xs font-semibold text-github-fg-muted uppercase tracking-wider mb-2 px-2">
                Explore repositories
              </h3>
              <div className="space-y-1">
                {allRepos.filter(r => r.owner?._id !== user._id).slice(0, 5).map(repo => (
                  <Link
                    key={repo._id}
                    to={`/${repo.owner?.username}/${repo.name}`}
                    className="block px-2 py-1.5 text-sm text-github-fg-muted hover:text-github-accent-fg hover:bg-github-bg-tertiary rounded-md no-underline truncate"
                  >
                    {repo.owner?.username}/{repo.name}
                  </Link>
                ))}
                {allRepos.filter(r => r.owner?._id !== user._id).length === 0 && (
                  <p className="text-xs text-github-fg-muted px-2">
                    No suggested repositories
                  </p>
                )}
              </div>
            </div>
          </aside>

          <main className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-github-fg-default">Repositories</h2>
              <Link
                to="/new"
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-white bg-github-btn-primary hover:bg-github-btn-primary-hover rounded-md border border-github-btn-primary-border no-underline transition-colors"
              >
                <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" className="fill-white">
                  <path d="M7.75 2a.75.75 0 0 1 .75.75V7h4.25a.75.75 0 0 1 0 1.5H8.5v4.25a.75.75 0 0 1-1.5 0V8.5H2.75a.75.75 0 0 1 0-1.5H7V2.75A.75.75 0 0 1 7.75 2Z" />
                </svg>
                New
              </Link>
            </div>

            <div className="mb-4">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Find a repository..."
                className="w-full px-3 py-2 bg-github-canvas border border-github-border-default rounded-md text-github-fg-default text-sm focus:outline-none focus:border-github-accent-fg focus:ring-1 focus:ring-github-accent-fg placeholder-github-fg-subtle"
              />
            </div>

            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border border-github-border-default rounded-md p-4 animate-pulse">
                    <div className="h-4 bg-github-bg-tertiary rounded w-48 mb-2" />
                    <div className="h-3 bg-github-bg-tertiary rounded w-72" />
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="border border-github-border-default rounded-md p-8 text-center">
                <svg aria-hidden="true" height="48" viewBox="0 0 16 16" version="1.1" width="48" className="fill-github-fg-muted mx-auto mb-3">
                  <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 010-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z" />
                </svg>
                <p className="text-github-fg-muted text-sm mb-4">
                  {search ? "No repositories match your search." : "You don't have any repositories yet."}
                </p>
                {!search && (
                  <Link to="/new" className="text-github-accent-fg text-sm font-semibold hover:underline no-underline">
                    Create your first repository
                  </Link>
                )}
              </div>
            ) : (
              <div className="border border-github-border-default rounded-md divide-y divide-github-border-default">
                {filtered.map((repo) => (
                  <div
                    key={repo._id}
                    className="p-4 hover:bg-github-canvas-subtle transition-colors cursor-pointer"
                    onClick={() => navigate(`/${repo.owner?.username || user.username}/${repo.name}`)}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" className="fill-github-fg-muted shrink-0">
                        <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 010-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z" />
                      </svg>
                      <Link
                        to={`/${repo.owner?.username || user.username}/${repo.name}`}
                        className="text-sm font-semibold text-github-accent-fg hover:underline no-underline"
                      >
                        {repo.owner?.username || user.username}/{repo.name}
                      </Link>
                      <span className={`text-xs border rounded-full px-2 py-0.5 font-medium ${
                        repo.visibility === "private"
                          ? "text-github-fg-muted border-github-border-default"
                          : "text-github-accent-fg border-github-accent-fg"
                      }`}>
                        {repo.visibility === "private" ? "Private" : "Public"}
                      </span>
                    </div>
                    {repo.description && (
                      <p className="text-xs text-github-fg-muted ml-6">{repo.description}</p>
                    )}
                    <div className="flex items-center gap-3 mt-1.5 ml-6">
                      <div className="flex items-center gap-1">
                        <span className="w-3 h-3 rounded-full bg-github-accent-emphasis" />
                        <span className="text-xs text-github-fg-muted">JavaScript</span>
                      </div>
                      {repo.issues && repo.issues.length > 0 && (
                        <span className="text-xs text-github-fg-muted">
                          {repo.issues.length} {repo.issues.length === 1 ? "issue" : "issues"}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
