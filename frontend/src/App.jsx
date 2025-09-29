import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
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
    const initialToken = localStorage.getItem('token');
    const initialUsername = localStorage.getItem('username');
    if (initialToken && initialUsername) {
      setToken(initialToken);
      setUser({ username: initialUsername });
    }
  }, []);

  useEffect(() => {
    if (token && !user) {
      const username = localStorage.getItem('username');
      if (username) {
        setUser({ username });
      }
    }
  }, [token, user]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setToken(null);
    setUser(null);
  };

  return (
    <Router>
      <div className="bg-light min-vh-100 d-flex flex-column">
        
        <nav className="navbar navbar-expand-lg navbar-dark bg-success">
          <div className="container-fluid">
            <Link className="navbar-brand fw-bold" to="/">SwapIt</Link>

            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                {user && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/wardrobe">My Wardrobe</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/listings">Fashion Items</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/inbox">Inbox</Link>
                    </li>
                  </>
                )}
              </ul>

              {!user ? (
                <div className="d-flex">
                  <Link to="/login" className="btn btn-outline-light me-2">Login</Link>
                  <Link to="/register" className="btn btn-outline-light">Register</Link>
                </div>
              ) : (
                <div className="d-flex align-items-center">
                  <span className="me-3 text-white">Hello, {user.username}</span>
                  <button
                    onClick={handleLogout}
                    className="btn btn-danger btn-sm"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>

        <main className="container my-4 flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/register"
              element={<Register setUser={setUser} setToken={setToken} apiBase={API_BASE} />}
            />
            <Route
              path="/login"
              element={<Login setUser={setUser} setToken={setToken} apiBase={API_BASE} />}
            />
            <Route
              path="/wardrobe"
              element={user ? (<Wardrobe user={user} apiBase={API_BASE} />) : (<Navigate to="/login" />)}
            />
            <Route
              path="/listings"
              element={user ? (<Listings user={user} apiBase={API_BASE} />) : (<Navigate to="/login" />)}
            />
            <Route
              path="/inbox"
              element={user ? (<Inbox user={user} apiBase={API_BASE} />) : (<Navigate to="/login" />)}
            />
          </Routes>
        </main>

        <footer className="bg-success text-white text-center py-3 mt-auto">
          <p className="mb-0">
            SwapIt &copy; {new Date().getFullYear()}. All rights reserved.
          </p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
