import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';  // Added Link
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
  const [user, setUser ] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const initialToken = localStorage.getItem('token');
    const initialUsername = localStorage.getItem('username');
    if (initialToken && initialUsername) {
      setToken(initialToken);
      setUser ({ username: initialUsername });
    }
  }, []);

  useEffect(() => {
    if (token && !user) {
      const username = localStorage.getItem('username');
      if (username) {
        setUser ({ username: username });
      }
    }
  }, [token, user]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setToken(null);
    setUser (null);
  };

  return (
    <Router>
      <div className="min-h-screen bg-green-50">
        <header className="bg-green-600 text-white p-4 flex justify-between items-center">
          <h1 className="text-2xl">Sustainable Fashion Swap</h1>
          {user && (
            <div className="flex items-center space-x-4">
              <nav className="space-x-4">
                <Link to="/wardrobe" className="hover:underline">My Wardrobe</Link>
                <Link to="/listings" className="hover:underline">Browse Swaps</Link>
                <Link to="/inbox" className="hover:underline">Inbox</Link>
              </nav>
              <button onClick={handleLogout} className="bg-red-500 px-4 py-1 rounded">Logout</button>
            </div>
          )}
        </header>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register setUser ={setUser } setToken={setToken} apiBase={API_BASE}/>} />
          <Route path="/login" element={<Login setUser ={setUser } setToken={setToken} apiBase={API_BASE}/>} />
          <Route path="/wardrobe" element={user ? (<Wardrobe user={user} apiBase={API_BASE}/>) : (<Navigate to="/login" />)} />
          <Route path="/listings" element={user ? (<Listings user={user} apiBase={API_BASE}/>) : (<Navigate to="/login" />)} />
          <Route path="/inbox" element={user ? (<Inbox user={user} apiBase={API_BASE}/>) : (<Navigate to="/login" />)} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
