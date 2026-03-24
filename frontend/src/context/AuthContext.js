'use client';

import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async (retry = true) => {
  try {
    const res = await fetch('http://localhost:5000/api/auth/me', {
      credentials: 'include',
      cache: 'no-store',
    });

    // ✅ NORMAL CASE (not logged in)
    if (res.status === 401) {
      setUser(null);
      setLoading(false);
      return null;
    }

    if (!res.ok) throw new Error();

    const data = await res.json();

    setUser(data.user);
    setLoading(false);

    return data;

  } catch (err) {
    // ❌ DON'T treat 401 as error
    console.error("Auth error:", err.message);
    setUser(null);
    setLoading(false);
    return null;
  }
};

  // ✅ THEN USE IT
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, refetch: fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};