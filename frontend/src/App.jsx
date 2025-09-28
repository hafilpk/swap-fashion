import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import Wardrobe from './components/Wardrobe';
import Listings from './components/Listings';
import Inbox from './components/Inbox';

const API_BASE = 'http://localhost:8000/api';

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      setUser({ username: localStorage.getItem('username') });
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setToken(null);
    setUser(null);
  };

  return (
    <Router>
      <div className="min-h-screen bg-green-50">
        <header className="bg-green-600 text-white p-4 flex justify-between items-center">
          <h1 className="text-2xl">Sustainable Fashion Swap</h1>
          {user && (
            <div className="flex items-center space-x-4">
              <nav className="space-x-4">
                <a href="/wardrobe" className="hover:underline">My Wardrobe</a>
                <a href="/listings" className="hover:underline">Browse Swaps</a>
                <a href="/inbox" className="hover:underline">Inbox</a>
              </nav>
              <button onClick={handleLogout} className="bg-red-500 px-4 py-1 rounded">Logout</button>
            </div>
          )}
        </header>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register setUser={setUser} setToken={setToken} />} />
          <Route path="/login" element={<Login setUser={setUser} setToken={setToken} />} />
          <Route path="/wardrobe" element={user ? <Wardrobe user={user} /> : <Navigate to="/login" />} />
          <Route path="/listings" element={user ? <Listings user={user} /> : <Navigate to="/login" />} />
          <Route path="/inbox" element={user ? <Inbox user={user} /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

