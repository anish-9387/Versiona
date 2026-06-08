import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-6 py-3 border-b border-[#30363d] bg-[#161b22]">
      <Link to="/" className="flex items-center gap-2 no-underline">
        <img src="/logo.png" alt="Versiona" className="w-8 h-8 rounded-full" />
        <span className="text-white font-semibold text-lg">Versiona</span>
      </Link>
      <div className="flex items-center gap-6">
        <Link to="/profile" className="text-[#c9d1d9] text-sm hover:text-white no-underline">
          Profile
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
