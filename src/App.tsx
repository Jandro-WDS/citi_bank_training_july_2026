import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Home from "./pages/Home.tsx";
import Login from "./pages/LoginPage.tsx";
import Signup from "./pages/SignupPage.tsx";
import Dashboard from "./pages/Dashboard.tsx"
import Services from "./pages/Services.tsx"
import { AuthProvider } from "./context/AuthContext.tsx";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/Services" element={<Services />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );

}

export default App;