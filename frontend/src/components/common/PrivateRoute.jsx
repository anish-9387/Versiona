import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

const PrivateRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-github-canvas flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-github-border-default border-t-github-accent-fg" />
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
