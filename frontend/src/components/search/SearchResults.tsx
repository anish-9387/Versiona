import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../../api/axios";
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";
import type { Repository } from "../../types";
import type { User } from "../../context/useAuth";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [users, setUsers] = useState<User[]>([]);
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(() => !!query.trim());

  useEffect(() => {
    if (!query.trim()) return;
    const fetchData = async () => {
      try {
        const [usersRes, reposRes] = await Promise.all([
          api.get<User[]>("/user/allUsers"),
          api.get<{ repositories: Repository[] }>("/repository/all"),
        ]);
        const allUsers = Array.isArray(usersRes.data) ? usersRes.data : [];
        const allRepos = Array.isArray(reposRes.data.repositories) ? reposRes.data.repositories : [];

        const q = query.toLowerCase();
        setUsers(allUsers.filter((u) => u.username?.toLowerCase().includes(q)));
        setRepos(allRepos.filter((r) => r.name?.toLowerCase().includes(q)));
      } catch {
        setUsers([]);
        setRepos([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [query]);

  return (
    <div className="min-h-screen bg-github-canvas flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-6 py-8">
        <h2 className="text-xl font-semibold text-github-fg-default mb-6">
          Search results for "<span className="text-github-accent-fg">{query}</span>"
        </h2>

        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-github-border-default rounded-md p-4 animate-pulse">
                <div className="h-4 bg-github-bg-tertiary rounded w-48 mb-2" />
                <div className="h-3 bg-github-bg-tertiary rounded w-72" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            {repos.length > 0 && (
              <section>
                <h3 className="text-sm font-semibold text-github-fg-muted uppercase tracking-wider mb-3">
                  Repositories ({repos.length})
                </h3>
                <div className="border border-github-border-default rounded-md divide-y divide-github-border-default">
                  {repos.map((repo) => (
                    <div key={repo._id} className="p-4 hover:bg-github-canvas-subtle transition-colors">
                      <div className="flex items-center gap-2 mb-1">
                        <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" className="fill-github-fg-muted shrink-0">
                          <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 010-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8z" />
                        </svg>
                        <Link
                          to={`/${repo.owner?.username}/${repo.name}`}
                          className="text-sm font-semibold text-github-accent-fg hover:underline no-underline"
                        >
                          {repo.owner?.username}/{repo.name}
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
                    </div>
                  ))}
                </div>
              </section>
            )}

            {users.length > 0 && (
              <section>
                <h3 className="text-sm font-semibold text-github-fg-muted uppercase tracking-wider mb-3">
                  Users ({users.length})
                </h3>
                <div className="border border-github-border-default rounded-md divide-y divide-github-border-default">
                  {users.map((u) => (
                    <Link
                      key={u._id}
                      to={`/${u.username}`}
                      className="flex items-center gap-3 p-4 hover:bg-github-canvas-subtle transition-colors no-underline"
                    >
                      <div className="w-8 h-8 rounded-full bg-github-bg-tertiary border border-github-border-default flex items-center justify-center text-sm font-semibold text-github-fg-default shrink-0">
                        {u.username?.[0]?.toUpperCase() || "?"}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-github-accent-fg">{u.username}</p>
                        <p className="text-xs text-github-fg-muted">{u.email}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {repos.length === 0 && users.length === 0 && (
              <div className="border border-github-border-default rounded-md p-8 text-center">
                <svg aria-hidden="true" height="48" viewBox="0 0 16 16" version="1.1" width="48" className="fill-github-fg-muted mx-auto mb-3">
                  <path d="M10.68 11.74a6 6 0 01-7.922-8.982 6 6 0 018.982 7.922l3.04 3.04a.749.749 0 01-.326 1.275.749.749 0 01-.734-.215l-3.04-3.04zM11.5 7a4.5 4.5 0 10-9 0 4.5 4.5 0 009 0z" />
                </svg>
                <p className="text-github-fg-muted text-sm">
                  No results found for "<strong className="text-github-fg-default">{query}</strong>"
                </p>
                <p className="text-xs text-github-fg-muted mt-1">
                  Try searching for a username or repository name.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default SearchResults;
