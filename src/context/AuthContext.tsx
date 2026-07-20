import { createContext, useContext, useState, type ReactNode } from "react";
import { setAuthToken } from "../api/client";

type Role = "admin" | "user" | null;

interface AuthContextType {
  token: string | null;
  role: Role;
  userId: string | null;
  login: (token: string, role: Role, userId: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<Role>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const login = (token: string, role: Role, userId: string) => {
    setToken(token);
    setRole(role);
    setUserId(userId);
    setAuthToken(token);
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    setUserId(null);
    setAuthToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, role, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}