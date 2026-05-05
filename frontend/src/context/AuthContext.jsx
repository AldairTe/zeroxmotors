import { createContext, useContext, useState } from 'react';
import { login as loginService, logout as logoutService, getUsuario } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(getUsuario());

  const login = async (email, password) => {
    const data = await loginService(email, password);
    setUsuario(data.usuario);
    return data;
  };

  const logout = () => {
    logoutService();
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);