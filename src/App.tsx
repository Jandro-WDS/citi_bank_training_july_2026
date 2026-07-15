import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Home from "./pages/Home.tsx";
import Login from "./pages/Login.tsx";
import Signup from "./pages/Signup.tsx";
import Dashboard from "./pages/Dashboard.tsx"
import Services from "./pages/Services.tsx"

function App() {
  return (

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Dashboard" element={<Dashboard />}/>
        <Route path="/Services" element={<Services/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;