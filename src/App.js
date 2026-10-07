import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
// import NotFound from "./pages/NotFound"; 
import Mainpage from "./pages/Mainpage";
import Register from "./pages/Register";
import BikeList from './pages/BikeList';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Mainpage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/bikes" element={<BikeList />} />

        {/* <Route path="*" element={<NotFound />} />  */}
      </Routes>
    </Router>
  );
};

export default App;
