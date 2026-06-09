import { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useSearchParams } from "react-router-dom";
import api from "../../api/axios";
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";

const IssueList = () => {
  const { username, repoName } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [repo, setRepo] = useState(null);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const statusFilter = searchParams.get("status") || "open";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const { data: repoData } = await api.get(`/repository/name/${repoName}`);
        if (!repoData.repository || repoData.repository.owner?.username !== username) {
          setError("Repository not found");
          return;
        }
        setRepo(repoData.repository);

        const { data: issueData } = await api.get(`/issue/all/${repoData.repository._id}`);
        setIssues(Array.isArray(issueData.issues) ? issueData.issues : []);
      } catch {
        setError("Failed to load issues");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [username, repoName]);

  const filtered = issues.filter((i) => {
    const matchesStatus = statusFilter === "all" || i.status === statusFilter;
    const matchesSearch =
      !search || i.title?.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

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
          <p className="text-github-danger-fg">{error || "Repository not found"}</p>
        </div>
      </div>
    );
  }

  const openCount = issues.filter((i) => i.status === "open").length;
  const closedCount = issues.filter((i) => i.status === "closed").length;

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
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-github-fg-default">Issues</h2>
          <Link
            to={`/${username}/${repoName}/issues/new`}
            className="px-4 py-1.5 bg-github-btn-primary hover:bg-github-btn-primary-hover text-white text-sm font-semibold rounded-md border border-github-btn-primary-border no-underline transition-colors"
          >
            New issue
          </Link>
        </div>

        <div className="border border-github-border-default rounded-md overflow-hidden">
          <div className="bg-github-canvas-subtle border-b border-github-border-default px-4 py-2 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-4 text-sm">
              <button
                onClick={() => setSearchParams({ status: "open" })}
                className={`flex items-center gap-1.5 bg-transparent cursor-pointer ${
                  statusFilter === "open"
                    ? "text-github-fg-default font-semibold"
                    : "text-github-fg-muted hover:text-github-fg-default"
                }`}
              >
                <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" className="fill-current">
                  <path d="M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                  <path d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z" />
                </svg>
                {openCount} Open
              </button>
              <button
                onClick={() => setSearchParams({ status: "closed" })}
                className={`flex items-center gap-1.5 bg-transparent cursor-pointer ${
                  statusFilter === "closed"
                    ? "text-github-fg-default font-semibold"
                    : "text-github-fg-muted hover:text-github-fg-default"
                }`}
              >
                <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" className="fill-current">
                  <path d="M11.28 6.78a.75.75 0 00-1.06-1.06L7.25 8.69 5.78 7.22a.75.75 0 00-1.06 1.06l2 2a.75.75 0 001.06 0l3.5-3.5z" />
                  <path d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z" />
                </svg>
                {closedCount} Closed
              </button>
            </div>
            <div className="flex-1" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search all issues..."
              className="w-full md:w-64 px-3 py-1.5 bg-github-canvas border border-github-border-default rounded-md text-github-fg-default text-sm focus:outline-none focus:border-github-accent-fg focus:ring-1 focus:ring-github-accent-fg placeholder-github-fg-subtle"
            />
          </div>

          {filtered.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-github-fg-muted text-sm">
                {search ? "No issues match your search." : "No issues yet."}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-github-border-default">
              {filtered.map((issue) => (
                <div
                  key={issue._id}
                  className="px-4 py-3 hover:bg-github-canvas-subtle transition-colors cursor-pointer flex items-start gap-3"
                  onClick={() => navigate(`/${username}/${repoName}/issues/${issue._id}`)}
                >
                  <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16"
                    className={`shrink-0 mt-1 fill-current ${
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
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-github-fg-default hover:text-github-accent-fg">
                        {issue.title}
                      </span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${
                        issue.status === "open"
                          ? "text-github-success-fg border-github-success-fg bg-[rgba(63,185,80,0.1)]"
                          : "text-github-danger-fg border-github-danger-fg bg-[rgba(248,81,73,0.1)]"
                      }`}>
                        {issue.status}
                      </span>
                    </div>
                    <p className="text-xs text-github-fg-muted mt-0.5">
                      #{issue._id?.slice(-6)} opened recently
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default IssueList;
