import { createContext, useContext, useState, useEffect } from 'react';
import client from '../api/client.js';
import { useToast } from './ToastContext.jsx';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      client.get('/auth/me')
        .then(res => setUser(res.data))
        .catch(() => {
          localStorage.removeItem('token');
          toast?.info?.('Tu sesión expiró. Volvé a ingresar.');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [toast]);

  const login = async (dni, password) => {
    const res = await client.post('/auth/login', { dni, password });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
    toast?.success?.(`¡Bienvenido, ${res.data.user.nombre}!`);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast?.info?.('Cerraste sesión correctamente.');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
