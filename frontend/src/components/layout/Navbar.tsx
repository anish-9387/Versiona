import { useState, useRef, useEffect } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const createRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDropdownOpen(false);
      if (createRef.current && !createRef.current.contains(e.target as Node)) setCreateOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-github-canvas-inset border-b border-github-border-default px-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/" className="shrink-0">
            <img src="/logo.png" alt="Versiona" className="h-8 w-8 rounded-full" />
          </Link>

          <form onSubmit={handleSearch} className="hidden md:block">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search or jump to..."
              className="w-72 px-3 py-1.5 bg-github-canvas border border-github-border-default rounded-md text-github-fg-default text-sm placeholder-github-fg-subtle focus:outline-none focus:border-github-accent-fg focus:ring-1 focus:ring-github-accent-fg"
            />
          </form>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/new" className="hidden md:flex items-center gap-1 px-3 py-1.5 text-sm text-github-fg-default bg-github-bg-tertiary border border-github-border-default rounded-md hover:bg-github-canvas-subtle no-underline">
            <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" className="fill-github-fg-muted">
              <path d="M7.75 2a.75.75 0 0 1 .75.75V7h4.25a.75.75 0 0 1 0 1.5H8.5v4.25a.75.75 0 0 1-1.5 0V8.5H2.75a.75.75 0 0 1 0-1.5H7V2.75A.75.75 0 0 1 7.75 2Z" />
            </svg>
            New
          </Link>

          <div className="relative" ref={createRef}>
            <button
              onClick={() => { setCreateOpen(!createOpen); setDropdownOpen(false); }}
              className="md:hidden p-2 text-github-fg-muted hover:text-github-fg-default rounded-md hover:bg-github-bg-tertiary cursor-pointer"
            >
              <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" className="fill-current">
                <path d="M7.75 2a.75.75 0 0 1 .75.75V7h4.25a.75.75 0 0 1 0 1.5H8.5v4.25a.75.75 0 0 1-1.5 0V8.5H2.75a.75.75 0 0 1 0-1.5H7V2.75A.75.75 0 0 1 7.75 2Z" />
              </svg>
            </button>
            {createOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-github-canvas-subtle border border-github-border-default rounded-md shadow-lg py-1 z-50">
                <Link to="/new" onClick={() => setCreateOpen(false)} className="block px-4 py-2 text-sm text-github-fg-default hover:bg-github-bg-tertiary no-underline">
                  New repository
                </Link>
              </div>
            )}
          </div>

          <Link to={`/${user?.username || ""}`} className="hidden md:flex p-2 text-github-fg-muted hover:text-github-fg-default rounded-md hover:bg-github-bg-tertiary" title="Profile">
            <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" className="fill-current">
              <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z" />
            </svg>
          </Link>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => { setDropdownOpen(!dropdownOpen); setCreateOpen(false); }}
              className="flex items-center gap-2 p-1.5 text-sm text-github-fg-default rounded-md hover:bg-github-bg-tertiary cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full bg-github-bg-tertiary border border-github-border-default flex items-center justify-center text-xs font-semibold text-github-fg-default overflow-hidden">
                {user?.username ? user.username[0].toUpperCase() : "?"}
              </div>
              <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" className={`fill-github-fg-muted transition-transform ${dropdownOpen ? "rotate-180" : ""}`}>
                <path d="M3.427 5.427a.75.75 0 0 1 1.06 0L8 8.94l3.513-3.513a.75.75 0 0 1 1.06 1.06l-4.043 4.043a.75.75 0 0 1-1.06 0L3.427 6.488a.75.75 0 0 1 0-1.06Z" />
              </svg>
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-60 bg-github-canvas-subtle border border-github-border-default rounded-md shadow-lg py-1 z-50">
                <div className="px-4 py-2 border-b border-github-border-default">
                  <p className="text-sm font-semibold text-github-fg-default">{user?.username || "Signed in user"}</p>
                  <p className="text-xs text-github-fg-muted truncate">{user?.email || ""}</p>
                </div>
                <Link to={`/${user?.username || ""}`} onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-github-fg-default hover:bg-github-bg-tertiary no-underline">
                  Your profile
                </Link>
                <Link to="/" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-github-fg-default hover:bg-github-bg-tertiary no-underline">
                  Your repositories
                </Link>
                <Link to="/settings" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-github-fg-default hover:bg-github-bg-tertiary no-underline">
                  Settings
                </Link>
                <div className="border-t border-github-border-default mt-1 pt-1">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-github-fg-default hover:bg-github-bg-tertiary cursor-pointer"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
