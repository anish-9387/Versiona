import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-github-border-default bg-github-canvas">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-github-fg-muted">
        <div className="flex items-center gap-4">
          <img src="/logo.png" alt="Versiona" className="h-6 w-6 rounded-full" />
          <span>&copy; 2026 Versiona, Inc.</span>
        </div>
        <nav className="flex flex-wrap items-center gap-4">
          <Link to="#" className="hover:text-github-accent-fg no-underline">Terms</Link>
          <Link to="#" className="hover:text-github-accent-fg no-underline">Privacy</Link>
          <Link to="#" className="hover:text-github-accent-fg no-underline">Security</Link>
          <Link to="#" className="hover:text-github-accent-fg no-underline">Status</Link>
          <Link to="#" className="hover:text-github-accent-fg no-underline">Docs</Link>
          <Link to="#" className="hover:text-github-accent-fg no-underline">Contact</Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
