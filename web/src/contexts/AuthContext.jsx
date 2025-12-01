import { createContext, useContext, useState, useEffect } from 'react';
import { getUser, getToken } from '../services/storage';
import { login as loginService, logout as logoutService } from '../services/auth';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    const savedUser = getUser();
    
    if (token && savedUser) {
      setUser(savedUser);
    }
    
    setLoading(false);
  }, []);

  const login = async (email, senha) => {
    const funcionario = await loginService(email, senha);
    setUser(funcionario);
    return funcionario;
  };

  const logout = () => {
    setUser(null);
    logoutService();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
