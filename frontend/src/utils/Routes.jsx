import { useEffect } from 'react';
import { useNavigate, useRoutes } from 'react-router-dom';

import Dashboard from '../components/dashboard/Dashboard.jsx';
import Profile from '../components/user/Profile.jsx';
import Login from '../components/auth/Login.jsx';
import Signup from '../components/auth/Signup.jsx';

import { useAuth } from '../context/AuthContext.jsx';

const Routes = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const userIdFromStorage = localStorage.getItem('userId');

    if (userIdFromStorage && !currentUser) {
      setCurrentUser({ id: userIdFromStorage });
    }

    if (!userIdFromStorage && !["/login", "/signup"].includes(window.location.pathname)) {
      navigate('/login');
    }

    if(userIdFromStorage && window.location.pathname === '/login') {
      navigate("/");
    }
  }, [currentUser, navigate, setCurrentUser]);

  let element = useRoutes([
    {
      path: "/",
      element: <Dashboard />
    },
    {
      path: "/profile",
      element: <Profile />
    },
    {
      path: "/login",
      element: <Login />
    },
    {
      path: "/signup",
      element: <Signup />
    }
  ]);

  return element;
}

export default Routes;