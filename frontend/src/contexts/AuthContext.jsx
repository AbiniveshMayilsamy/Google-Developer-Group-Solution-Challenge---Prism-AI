import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5001';

const call = async (path, body) => {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const text = await res.text();
  let data;
  try { 
    data = JSON.parse(text); 
  } catch { 
    data = { message: text }; 
  }
  if (!res.ok) {
    const errorMsg = (data.message && typeof data.message === 'string' && !data.message.trim().startsWith('<'))
      ? data.message
      : 'Server error: Invalid response format or server offline';
    throw new Error(errorMsg);
  }
  return data;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('prism_user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch { localStorage.removeItem('prism_user'); }
    }
    setLoading(false);
  }, []);

  const save = (data) => {
    setUser(data);
    localStorage.setItem('prism_user', JSON.stringify(data));
  };

  const login = async (email, password) => {
    const data = await call('/api/auth/login', { email, password });
    save(data);
    return data;
  };

  const register = async (name, email, password) => {
    const data = await call('/api/auth/register', { name, email, password });
    save(data);
    return data;
  };

  const googleLogin = async (credential) => {
    const data = await call('/api/auth/google', { credential });
    save(data);
    return data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('prism_user');
    localStorage.removeItem('current_analysis_metrics');
    localStorage.removeItem('current_analysis_config');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, googleLogin, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
