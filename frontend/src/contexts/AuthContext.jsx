import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

// MOCK USERS — no database needed
const MOCK_USERS = {
  admin: {
    _id: 'mock_admin_001',
    name: 'Demo Admin',
    email: 'admin@prismai.com',
    role: 'admin',
    token: 'mock_token_admin'
  },
  user: {
    _id: 'mock_user_001',
    name: 'Demo User',
    email: 'user@prismai.com',
    role: 'user',
    token: 'mock_token_user'
  }
};

export function AuthProvider({ children }) {
  // Auto-login as admin for instant demo access
  const [user, setUser] = useState(MOCK_USERS.admin);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user previously chose a role
    const stored = localStorage.getItem('prism_mock_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  // Called by Login.jsx for instant access
  const setMockUser = (role = 'admin') => {
    const mockUser = MOCK_USERS[role] || MOCK_USERS.user;
    setUser(mockUser);
    localStorage.setItem('prism_mock_user', JSON.stringify(mockUser));
  };

  // Kept for compatibility — just sets mock user
  const login = async (email) => {
    const role = email?.includes('admin') ? 'admin' : 'user';
    setMockUser(role);
    return MOCK_USERS[role];
  };

  const register = async (name, email) => {
    const newUser = { ...MOCK_USERS.user, name: name || 'New User', email };
    setUser(newUser);
    localStorage.setItem('prism_mock_user', JSON.stringify(newUser));
    return newUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('prism_mock_user');
  };

  const value = {
    user,
    login,
    register,
    logout,
    setMockUser,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
