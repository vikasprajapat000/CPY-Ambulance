import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || '/api';

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('cpy_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (data.success) {
        setUser(data.data);
        localStorage.setItem('cpy_user', JSON.stringify(data.data));
        return { success: true, user: data.data };
      } else {
        return { success: false, message: data.message };
      }
    } catch (err) {
      return { success: false, message: 'Server error during login' };
    }
  };

  const register = async (userData) => {
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const data = await res.json();
      
      if (data.success) {
        // We log them in automatically upon registration IF they aren't an unapproved driver
        if (data.data.role === 'DRIVER' && !data.data.isApproved) {
           return { success: true, user: data.data, pendingApproval: true };
        } else {
           setUser(data.data);
           localStorage.setItem('cpy_user', JSON.stringify(data.data));
           return { success: true, user: data.data };
        }
      } else {
        return { success: false, message: data.message };
      }
    } catch (err) {
      console.error('Registration fetch error:', err);
      return { success: false, message: `Network/Parse Error: ${err.message}` };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cpy_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
