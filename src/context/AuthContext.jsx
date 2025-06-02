import { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, register as apiRegister, checkAuth } from '../api/auth';
import { setToken, clearToken } from '../utils/storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
    } catch (err) {
      clearToken();
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  verifyAuth();
}, []);


  const login = async (credentials) => {
    const { token, user } = await apiLogin(credentials);
    setToken(token);
    setUser(user);
    setIsAuthenticated(true);
    return user;
  };

  const register = async (credentials) => {
    const { token, user } = await apiRegister(credentials);
    setToken(token);
    setUser(user);
    setIsAuthenticated(true);
    return user;
  };

  const logout = () => {
    clearToken();
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = '/login';
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