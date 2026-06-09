import { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import api from "../../api/axios";
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";
import HeatMapProfile from "./HeatMap";

const Profile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [profileUser, setProfileUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState(() => {
    const params = new URLSearchParams(location.search);
    return params.get("tab") || "overview";
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        let userId;
        if (username) {
          const { data: allUsers } = await api.get("/user/allUsers");
          const found = Array.isArray(allUsers)
            ? allUsers.find((u) => u.username === username)
            : null;
          if (!found) {
            setError("User not found");
            setLoading(false);
            return;
          }
          userId = found._id;
          setProfileUser(found);
        } else {
          userId = localStorage.getItem("userId");
          const { data } = await api.get(`/user/${userId}`);
          setProfileUser(data);
        }

        const { data: repoData } = await api.get(`/repository/user/${userId}`);
        setRepos(Array.isArray(repoData.repositories) ? repoData.repositories : []);
      } catch {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [username]);

  const filteredRepos = repos.filter((r) =>
    r.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleTabChange = (newTab) => {
    setTab(newTab);
    navigate(`/${profileUser?.username}?tab=${newTab}`, { replace: true });
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

  if (error || !profileUser) {
    return (
      <div className="min-h-screen bg-github-canvas">
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 py-12 text-center">
          <p className="text-github-danger-fg text-lg">{error || "User not found"}</p>
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
          <div className="flex flex-col md:flex-row gap-4 pt-6 pb-0">
            <div className="md:w-72 shrink-0 flex md:flex-col items-center md:items-start gap-4 md:gap-0">
              <div className="w-16 h-16 md:w-72 md:h-72 rounded-full bg-github-bg-tertiary border border-github-border-default flex items-center justify-center text-2xl md:text-7xl font-light text-github-fg-muted overflow-hidden shrink-0">
                {profileUser.username?.[0]?.toUpperCase() || "?"}
              </div>
              <div className="text-center md:text-left mt-0 md:mt-4">
                <h1 className="text-xl md:text-2xl font-semibold text-github-fg-default">{profileUser.username}</h1>
                <p className="text-sm md:text-base text-github-fg-muted">{profileUser.email}</p>
              </div>
              <div className="hidden md:block w-full mt-4">
                <button className="w-full py-1.5 px-4 bg-github-bg-tertiary hover:bg-github-canvas-subtle text-github-fg-default text-sm font-semibold rounded-md border border-github-border-default cursor-pointer transition-colors">
                  Follow
                </button>
              </div>
              <div className="hidden md:flex items-center gap-3 mt-4 text-sm text-github-fg-muted">
                <span>
                  <strong className="text-github-fg-default font-semibold">{repos.length}</strong>{" "}
                  {repos.length === 1 ? "repository" : "repositories"}
                </span>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <nav className="flex gap-0 md:gap-2 -mb-px overflow-x-auto">
                <button
                  onClick={() => handleTabChange("overview")}
                  className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 bg-transparent cursor-pointer flex items-center gap-2 ${tab === "overview"
                      ? "text-github-fg-default border-github-attention-fg"
                      : "text-github-fg-muted border-transparent hover:text-github-fg-default hover:border-github-border-default"
                    }`}
                >
                  <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" className="fill-current">
                    <path d="M1 2.75C1 1.784 1.784 1 2.75 1h10.5c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0113.25 15H2.75A1.75 1.75 0 011 13.25V2.75zm1.75-.25a.25.25 0 00-.25.25v10.5c0 .138.112.25.25.25h10.5a.25.25 0 00.25-.25V2.75a.25.25 0 00-.25-.25H2.75z" />
                    <path d="M6.5 8.043V4.5a1 1 0 012 0v3.543a1 1 0 01-.5.866l-1.5.866a1 1 0 01-1-1.732l1-.578z" />
                  </svg>
                  Overview
                </button>
                <button
                  onClick={() => handleTabChange("repositories")}
                  className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 bg-transparent cursor-pointer flex items-center gap-2 ${tab === "repositories"
                      ? "text-github-fg-default border-github-attention-fg"
                      : "text-github-fg-muted border-transparent hover:text-github-fg-default hover:border-github-border-default"
                    }`}
                >
                  <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" className="fill-current">
                    <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 010-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z" />
                  </svg>
                  Repositories{" "}
                  <span className="text-xs text-github-fg-muted font-normal">({repos.length})</span>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-72 shrink-0 md:hidden">
            <button className="w-full py-1.5 px-4 bg-github-bg-tertiary hover:bg-github-canvas-subtle text-github-fg-default text-sm font-semibold rounded-md border border-github-border-default cursor-pointer transition-colors">
              Follow
            </button>
            <div className="flex items-center gap-3 mt-4 text-sm text-github-fg-muted">
              <span>
                <strong className="text-github-fg-default font-semibold">{repos.length}</strong>{" "}
                {repos.length === 1 ? "repository" : "repositories"}
              </span>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            {tab === "overview" && (
              <div>
                <div className="mb-4">
                  <HeatMapProfile />
                </div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold text-github-fg-default">Popular repositories</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {repos.slice(0, 6).map((repo) => (
                    <div
                      key={repo._id}
                      className="border border-github-border-default rounded-md p-4 hover:bg-github-canvas-subtle transition-colors cursor-pointer"
                      onClick={() => navigate(`/${profileUser.username}/${repo.name}`)}
                    >
                      <Link
                        to={`/${profileUser.username}/${repo.name}`}
                        className="text-sm font-semibold text-github-accent-fg hover:underline no-underline"
                      >
                        {repo.name}
                      </Link>
                      {repo.description && (
                        <p className="text-xs text-github-fg-muted mt-1 line-clamp-2">{repo.description}</p>
                      )}
                      <div className="flex items-center gap-3 mt-2">
                        <span className="flex items-center gap-1">
                          <span className="w-3 h-3 rounded-full bg-github-accent-emphasis" />
                          <span className="text-xs text-github-fg-muted">JavaScript</span>
                        </span>
                        <span className={`text-xs border rounded-full px-2 py-0.5 ${repo.visibility === "private"
                            ? "text-github-fg-muted border-github-border-default"
                            : "text-github-accent-fg border-github-accent-fg"
                          }`}>
                          {repo.visibility === "private" ? "Private" : "Public"}
                        </span>
                      </div>
                    </div>
                  ))}
                  {repos.length === 0 && (
                    <div className="col-span-full text-center py-8">
                      <p className="text-github-fg-muted text-sm">
                        This user doesn't have any public repositories yet.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {tab === "repositories" && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Find a repository..."
                      className="w-full px-3 py-2 bg-github-canvas border border-github-border-default rounded-md text-github-fg-default text-sm focus:outline-none focus:border-github-accent-fg focus:ring-1 focus:ring-github-accent-fg placeholder-github-fg-subtle"
                    />
                  </div>
                </div>

                {filteredRepos.length === 0 ? (
                  <div className="border border-github-border-default rounded-md p-8 text-center">
                    <svg aria-hidden="true" height="48" viewBox="0 0 16 16" version="1.1" width="48" className="fill-github-fg-muted mx-auto mb-3">
                      <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 010-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8z" />
                    </svg>
                    <p className="text-github-fg-muted text-sm">
                      {search ? "No repositories match." : "No repositories yet."}
                    </p>
                  </div>
                ) : (
                  <div className="border border-github-border-default rounded-md divide-y divide-github-border-default">
                    {filteredRepos.map((repo) => (
                      <div
                        key={repo._id}
                        className="p-4 hover:bg-github-canvas-subtle transition-colors cursor-pointer"
                        onClick={() => navigate(`/${profileUser.username}/${repo.name}`)}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" className="fill-github-fg-muted shrink-0">
                            <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 010-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8z" />
                          </svg>
                          <Link
                            to={`/${profileUser.username}/${repo.name}`}
                            className="text-sm font-semibold text-github-accent-fg hover:underline no-underline"
                          >
                            {repo.name}
                          </Link>
                          <span className={`text-xs border rounded-full px-2 py-0.5 font-medium ${repo.visibility === "private"
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
                          <span className="flex items-center gap-1">
                            <span className="w-3 h-3 rounded-full bg-github-accent-emphasis" />
                            <span className="text-xs text-github-fg-muted">JavaScript</span>
                          </span>
                          {repo.issues?.length > 0 && (
                            <Link
                              to={`/${profileUser.username}/${repo.name}/issues`}
                              className="text-xs text-github-fg-muted hover:text-github-accent-fg no-underline"
                            >
                              {repo.issues.length} {repo.issues.length === 1 ? "issue" : "issues"}
                            </Link>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
