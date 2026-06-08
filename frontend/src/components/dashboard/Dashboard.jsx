import { useState, useEffect } from "react";
import Navbar from "../Navbar";

const Dashboard = () => {
  const [repositories, setRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestedRepositories, setSuggestedRepositories] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    const fetchRepositories = async () => {
      try {
        const response = await fetch(`/repository/user/${userId}`);
        const data = await response.json();
        setRepositories(Array.isArray(data.repositories) ? data.repositories : []);
      } catch (err) {
        console.error("Error while fetching repositories: ", err);
      }
    };

    const fetchSuggestedRepositories = async () => {
      try {
        const response = await fetch(`/repository/all`);
        const data = await response.json();
        setSuggestedRepositories(Array.isArray(data.repositories) ? data.repositories : []);
      } catch (err) {
        console.error("Error while fetching repositories: ", err);
      }
    };

    fetchRepositories();
    fetchSuggestedRepositories();
  }, []);

  useEffect(() => {
    if (searchQuery == "") {
      setSearchResults(repositories);
    } else {
      const filteredRepo = repositories.filter((repo) =>
        repo.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filteredRepo);
    }
  }, [searchQuery, repositories]);

  return (
    <div className="min-h-screen bg-[#0d1117]">
      <Navbar />
      <div className="max-w-screen-xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          <aside className="w-64 shrink-0">
            <h3 className="text-[#c9d1d9] text-sm font-semibold mb-3">Suggested Repositories</h3>
            <div className="space-y-3">
              {suggestedRepositories.length === 0 ? (
                <p className="text-[#8b949e] text-xs">No suggested repositories</p>
              ) : (
                suggestedRepositories.map((repo) => (
                  <div key={repo._id} className="border border-[#30363d] rounded-md p-3">
                    <h4 className="text-[#58a6ff] text-sm font-medium">{repo.name}</h4>
                    <p className="text-[#8b949e] text-xs mt-1">{repo.description}</p>
                  </div>
                ))
              )}
            </div>
          </aside>
          <main className="flex-1 min-w-0">
            <h2 className="text-[#c9d1d9] text-lg font-semibold mb-4">Your Repositories</h2>
            <div className="mb-4">
              <input
                type="text"
                value={searchQuery}
                placeholder="Search repositories..."
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-md text-[#c9d1d9] text-sm focus:outline-none focus:border-[#58a6ff]"
              />
            </div>
            <div className="space-y-2">
              {searchResults.length === 0 ? (
                <p className="text-[#8b949e] text-sm">No repositories found</p>
              ) : (
                searchResults.map((repo) => (
                  <div key={repo._id} className="border border-[#30363d] rounded-md p-4 hover:border-[#8b949e] transition-colors">
                    <div className="flex items-center gap-2">
                      <svg viewBox="0 0 16 16" className="w-4 h-4 fill-[#8b949e] shrink-0">
                        <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 010-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z" />
                      </svg>
                      <h4 className="text-[#58a6ff] text-sm font-medium">{repo.name}</h4>
                      <span className="text-[#8b949e] text-xs border border-[#30363d] rounded-full px-2 py-0.5">
                        {repo.visibility ? "Private" : "Public"}
                      </span>
                    </div>
                    {repo.description && (
                      <p className="text-[#8b949e] text-xs mt-1 ml-6">{repo.description}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </main>
          <aside className="w-64 shrink-0">
            <h3 className="text-[#c9d1d9] text-sm font-semibold mb-3">Latest Updates</h3>
            <ul className="space-y-2 text-[#8b949e] text-xs">
              <li className="flex items-center gap-2">
                <svg viewBox="0 0 16 16" className="w-4 h-4 fill-[#8b949e] shrink-0">
                  <path d="M8 0a8 8 0 100 16A8 8 0 008 0zM7 3a1 1 0 012 0v4a1 1 0 01-2 0V3zm1 8.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
                </svg>
                <span>New release v2.0.0</span>
              </li>
              <li className="flex items-center gap-2">
                <svg viewBox="0 0 16 16" className="w-4 h-4 fill-[#8b949e] shrink-0">
                  <path d="M8 0a8 8 0 100 16A8 8 0 008 0zM7 3a1 1 0 012 0v4a1 1 0 01-2 0V3zm1 8.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
                </svg>
                <span>System maintenance Dec 20</span>
              </li>
              <li className="flex items-center gap-2">
                <svg viewBox="0 0 16 16" className="w-4 h-4 fill-[#8b949e] shrink-0">
                  <path d="M8 0a8 8 0 100 16A8 8 0 008 0zM7 3a1 1 0 012 0v4a1 1 0 01-2 0V3zm1 8.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
                </svg>
                <span>API v3 deprecation notice</span>
              </li>
            </ul>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
