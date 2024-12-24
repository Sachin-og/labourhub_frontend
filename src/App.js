import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import ProtectedRoute from './pages/ProtectedRoutes';
import Navbar from './components/Navbar/Navbar'
import Home from "./pages/Home"
import DummyProfile from './pages/DummyProfile';
import Feed from './components/Feed/Feed';
import Notification from './pages/notification';
import Sidebar from './components/sidebar/Sidebar';
import ChatScreen from './pages/ChatScreen';
function App() {
  const currentUserId = sessionStorage.getItem('userId');
  return (
    <Router>
        <Navbar />
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/users/:userId" element={<DummyProfile />} />
        <Route path="/notifications/:userId" element={<Notification />} />
        <Route path="/chat" element={<ChatScreen/>} />

        

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/feed"
          element={
            <ProtectedRoute>
              <Feed />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
