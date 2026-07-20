import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { ReactNode } from "react";

export default function UserRoute({ children }: { children: ReactNode }) {
  const { token, role } = useAuth();

  if (!token) return <Navigate to="/login" replace />;
  if (role !== "user") return <Navigate to="/admin" replace />;

  return <>{children}</>;
}
