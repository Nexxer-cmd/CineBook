import { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, login as loginService, register as registerService, logout as logoutService } from '../services/dataService.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = getCurrentUser();
    if (savedUser) setUser(savedUser);
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const result = loginService(email, password);
    if (result) {
      setUser(result);
      return { success: true };
    }
    return { success: false, error: 'Invalid email or password' };
  };

  const register = (userData) => {
    const result = registerService(userData);
    if (result.error) {
      return { success: false, error: result.error };
    }
    setUser(result);
    return { success: true };
  };

  const logout = () => {
    logoutService();
    setUser(null);
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
