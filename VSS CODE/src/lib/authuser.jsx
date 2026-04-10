import React, { createContext, useContext, useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

const AuthUserContext = createContext(null);

export function AuthUserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.auth.me()
      .then((u) => setUser(u))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const isTeacher = user?.email?.endsWith('@gmail.com') || false;
  const isStudent = user?.email?.endsWith('@nv.ccsd.net') || false;

  const login = () => {
    base44.auth.redirectToLogin(window.location.pathname);
  };

  const logout = () => {
    base44.auth.logout('/');
  };

  return (
    <AuthUserContext.Provider value={{ user, loading, isTeacher, isStudent, login, logout }}>
      {children}
    </AuthUserContext.Provider>
  );
}

export function useAuthUser() {
  return useContext(AuthUserContext);
}