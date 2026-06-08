import { useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setCurrentUser } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await axios.post("/user/login", {
        email: email,
        password: password,
      });

      const token = res.data.token;
      const userId = res.data.userId || JSON.parse(atob(token.split(".")[1])).userId;

      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);

      setCurrentUser(userId);
      setLoading(false);

      window.location.href = "/";
    } catch (err) {
      console.error(err);
      alert("Login Failed!");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] flex flex-col items-center justify-center px-4">
      <div className="mb-6">
        <img src="/logo.png" alt="Versiona" className="w-16 h-16 mx-auto" />
      </div>

      <div className="w-full max-w-sm">
        <div className="bg-[#161b22] border border-[#30363d] rounded-md p-4">
          <h1 className="text-[#c9d1d9] text-xl text-center mb-4">Sign In</h1>
          <form onSubmit={handleLogin} className="space-y-3">
            <div>
              <label className="block text-[#c9d1d9] text-sm font-medium mb-1">Email address</label>
              <input
                autoComplete="off"
                name="Email"
                id="Email"
                className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-md text-[#c9d1d9] text-sm focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff]"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[#c9d1d9] text-sm font-medium mb-1">Password</label>
              <input
                autoComplete="off"
                name="Password"
                id="Password"
                className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-md text-[#c9d1d9] text-sm focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff]"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-[#238636] hover:bg-[#2ea043] text-white text-sm font-semibold rounded-md border border-[#2ea043] cursor-pointer disabled:opacity-50"
            >
              {loading ? "Loading..." : "Sign In"}
            </button>
          </form>
        </div>
        <div className="mt-3 border border-[#30363d] rounded-md p-4 text-center">
          <p className="text-[#8b949e] text-sm">
            New to Versiona?{" "}
            <Link to="/signup" className="text-[#58a6ff] no-underline hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
