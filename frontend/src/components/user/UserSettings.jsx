import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/useAuth";
import Navbar from "../layout/Navbar";

const UserSettings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (password && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      setSaving(true);
      const body = { email };
      if (password) body.password = password;
      await api.put(`/user/${user._id}`, body);
      setMessage("Profile updated successfully.");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (deleteConfirm !== user.username) return;
    try {
      await api.delete(`/user/${user._id}`);
      logout();
      navigate("/login", { replace: true });
    } catch {
      setError("Failed to delete account.");
    }
  };

  return (
    <div className="min-h-screen bg-github-canvas">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-8">
        <div className="mb-6">
          <Link to={`/${user?.username}`} className="text-github-accent-fg text-sm hover:underline no-underline">
            &larr; Back to profile
          </Link>
        </div>

        <h1 className="text-2xl font-semibold text-github-fg-default mb-6">Account settings</h1>

        {error && (
          <div className="mb-4 p-3 text-sm text-github-danger-fg bg-[rgba(248,81,73,0.1)] border border-[rgba(248,81,73,0.4)] rounded-md">
            {error}
          </div>
        )}
        {message && (
          <div className="mb-4 p-3 text-sm text-github-success-fg bg-[rgba(63,185,80,0.1)] border border-[rgba(63,185,80,0.4)] rounded-md">
            {message}
          </div>
        )}

        <div className="border border-github-border-default rounded-md p-6 mb-6">
          <h2 className="text-base font-semibold text-github-fg-default mb-4">Profile</h2>
          <form onSubmit={handleUpdate} className="space-y-4 max-w-md">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-github-fg-default mb-1">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-github-canvas border border-github-border-default rounded-md text-github-fg-default text-sm focus:outline-none focus:border-github-accent-fg focus:ring-1 focus:ring-github-accent-fg placeholder-github-fg-subtle"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-github-fg-default mb-1">
                New password <span className="text-github-fg-muted font-normal">(leave blank to keep current)</span>
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                className="w-full px-3 py-2 bg-github-canvas border border-github-border-default rounded-md text-github-fg-default text-sm focus:outline-none focus:border-github-accent-fg focus:ring-1 focus:ring-github-accent-fg placeholder-github-fg-subtle"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-github-fg-default mb-1">
                Confirm new password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                className="w-full px-3 py-2 bg-github-canvas border border-github-border-default rounded-md text-github-fg-default text-sm focus:outline-none focus:border-github-accent-fg focus:ring-1 focus:ring-github-accent-fg placeholder-github-fg-subtle"
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-1.5 bg-github-btn-primary hover:bg-github-btn-primary-hover text-white text-sm font-semibold rounded-md border border-github-btn-primary-border cursor-pointer disabled:opacity-50 transition-colors"
            >
              {saving ? "Updating..." : "Update profile"}
            </button>
          </form>
        </div>

        <div className="border border-github-danger-fg rounded-md p-6">
          <h2 className="text-base font-semibold text-github-danger-fg mb-4">Danger Zone</h2>
          <p className="text-sm text-github-fg-muted mb-3">
            Once you delete your account, there is no going back. All your data will be permanently removed.
          </p>
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder={`Type "${user?.username}" to confirm`}
              className="flex-1 px-3 py-2 bg-github-canvas border border-github-border-default rounded-md text-github-fg-default text-sm focus:outline-none focus:border-github-danger-fg focus:ring-1 focus:ring-github-danger-fg placeholder-github-fg-subtle"
            />
            <button
              onClick={handleDelete}
              disabled={deleteConfirm !== user?.username}
              className="px-4 py-2 bg-github-danger-emphasis hover:bg-[#b62324] text-white text-sm font-semibold rounded-md border border-github-danger-emphasis cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Delete account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
