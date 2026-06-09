import { useRoutes, Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

import Dashboard from "../components/home/Dashboard";
import Login from "../components/auth/Login";
import Signup from "../components/auth/Signup";
import Profile from "../components/user/Profile";
import UserSettings from "../components/user/UserSettings";
import SearchResults from "../components/search/SearchResults";
import RepoPage from "../components/repo/RepoPage";
import NewRepo from "../components/repo/NewRepo";
import RepoSettings from "../components/repo/RepoSettings";
import IssueList from "../components/issue/IssueList";
import IssueDetail from "../components/issue/IssueDetail";
import NewIssue from "../components/issue/NewIssue";

const ProjectRoutes = () => {
  const { user } = useAuth();

  const element = useRoutes([
    {
      path: "/",
      element: user ? <Dashboard /> : <Navigate to="/login" replace />,
    },
    {
      path: "/login",
      element: user ? <Navigate to="/" replace /> : <Login />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
    {
      path: "/new",
      element: user ? <NewRepo /> : <Navigate to="/login" replace />,
    },
    {
      path: "/settings",
      element: user ? <UserSettings /> : <Navigate to="/login" replace />,
    },
    {
      path: "/search",
      element: user ? <SearchResults /> : <Navigate to="/login" replace />,
    },
    {
      path: "/:username",
      element: user ? <Profile /> : <Navigate to="/login" replace />,
    },
    {
      path: "/:username/:repoName",
      element: user ? <RepoPage /> : <Navigate to="/login" replace />,
    },
    {
      path: "/:username/:repoName/issues",
      element: user ? <IssueList /> : <Navigate to="/login" replace />,
    },
    {
      path: "/:username/:repoName/issues/new",
      element: user ? <NewIssue /> : <Navigate to="/login" replace />,
    },
    {
      path: "/:username/:repoName/issues/:issueId",
      element: user ? <IssueDetail /> : <Navigate to="/login" replace />,
    },
    {
      path: "/:username/:repoName/settings",
      element: user ? <RepoSettings /> : <Navigate to="/login" replace />,
    },
    {
      path: "*",
      element: <Navigate to="/" replace />,
    },
  ]);

  return element;
};

export default ProjectRoutes;
