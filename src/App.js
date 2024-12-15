import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import ProtectedRoute from './pages/ProtectedRoutes';
import Navbar from './components/Navbar/Navbar'
import Home from "./pages/Home"
function App() {
  return (
    <Router>
        <Navbar />
      <Routes>
        <Route path="/Home" element={<Home />} />
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
