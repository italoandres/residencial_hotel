import api from './api';
import { setToken, setUser, clearStorage, getToken } from './storage';

export const login = async (email, senha) => {
  const response = await api.post('/auth/login', { email, senha });
  const { token, funcionario } = response.data;
  
  setToken(token);
  setUser(funcionario);
  
  return funcionario;
};

export const logout = () => {
  clearStorage();
  window.location.href = '/login';
};

export const isAuthenticated = () => {
  return !!getToken();
};
