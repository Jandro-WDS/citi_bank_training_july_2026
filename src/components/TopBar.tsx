import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Building2, LogOut } from "lucide-react";

interface Props {
  title: string;
  subtitle?: string;
}

export default function TopBar({ title, subtitle }: Props) {
  const { logout, role } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Building2 size={16} className="text-white" />
          </div>
          <div className="leading-tight">
            <p className="font-bold text-slate-900 text-sm">{title}</p>
            {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden sm:inline-flex text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full capitalize">
            {role ?? "guest"}
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-red-500 transition"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
