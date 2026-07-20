import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { AuthProvider } from "./context/AuthContext.tsx";
import AdminRoute from "./components/AdminRoute.tsx";
import UserRoute from "./components/UserRoute.tsx";

import Home from "./pages/Home.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import SignupPage from "./pages/SignupPage.tsx";

import AdminDashboard from "./pages/admin/AdminDashboard.tsx";
import UserDashboard from "./pages/user/UserDashboard.tsx";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: { fontFamily: "Inter, sans-serif", fontSize: "14px" },
          }}
        />
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Admin */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          {/* User */}
          <Route
            path="/dashboard"
            element={
              <UserRoute>
                <UserDashboard />
              </UserRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;