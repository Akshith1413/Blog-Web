import { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, register as apiRegister, checkAuth } from '../api/auth';
import { setToken, clearToken } from '../utils/storage';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const publicPaths = ['/login', '/register'];
    const currentPath = window.location.pathname;

    const verifyAuth = async () => {
      // Skip auth check for public pages
      if (publicPaths.includes(currentPath)) {
        setIsLoading(false);
        return;
      }

      try {
        const data = await checkAuth();
        setUser(data.user);
        setIsAuthenticated(true);
        
        // Redirect to appropriate dashboard based on role if on root path
        if (window.location.pathname === '/') {
          if (data.user.role === 'admin') {
            navigate('/admin');
          } else if (data.user.role === 'author') {
            navigate('/author');
          } else {
            navigate('/reader');
          }
        }
      } catch (err) {
        clearToken();
        setUser(null);
        setIsAuthenticated(false);
        if (!publicPaths.includes(currentPath)) {
          navigate('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, [navigate]);

  const login = async (credentials) => {
    setIsLoading(true);
    try {
      const { token, user } = await apiLogin(credentials);
      setToken(token);
      setUser(user);
      setIsAuthenticated(true);
      
      // Redirect based on role after login
      if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'author') {
        navigate('/author');
      } else {
        navigate('/reader');
      }
      
      return user;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (credentials) => {
    setIsLoading(true);
    try {
      const { token, user } = await apiRegister(credentials);
      setToken(token);
      setUser(user);
      setIsAuthenticated(true);
      
      // Redirect based on role after registration
      if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'author') {
        navigate('/author');
      } else {
        navigate('/reader');
      }
      
      return user;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearToken();
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);