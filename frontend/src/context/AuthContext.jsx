import { createContext, useContext, useState, useEffect } from 'react';
import { login as loginService, register as registerService, getMe, logout as logoutService } from '../services/auth';
import { getToken } from '../utils/token';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      if (!getToken()) {
        logoutService();
        setLoading(false);
        return;
      }

      try {
        const currentUser = await getMe();
        setUser(currentUser);
      } catch {
        logoutService();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (email, password) => {
    const { user: u } = await loginService(email, password);
    setUser(u);
    return u;
  };

  const register = async (data) => {
    const { user: u } = await registerService(data);
    setUser(u);
    return u;
  };

  const logout = () => {
    logoutService();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
