import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

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
              </nav>
              <button onClick={handleLogout} className="bg-red-500 px-4 py-1 rounded">Logout</button>
            </div>
          )}
        </header>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/register"
            element={<Register setUser={setUser} setToken={setToken} />}
          />
          <Route
            path="/login"
            element={<Login setUser={setUser} setToken={setToken} />}
          />
          <Route
            path="/wardrobe"
            element={user ? <Wardrobe user={user} /> : <Navigate to="/login" />}
          />
          <Route
            path="/listings"
            element={user ? <Listings user={user} /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </Router>
  );
}

function Home() {
  return (
    <div className="p-8 text-center">
      <h2 className="text-xl mb-4">Join the swap revolution!</h2>
      <div>
        <a
          href="/register"
          className="bg-green-500 text-white px-4 py-2 rounded mr-2"
        >
          Register
        </a>
        <a
          href="/login"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Login
        </a>
      </div>
    </div>
  );
}

function Register({ setUser, setToken }) {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/auth/register/`, formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('username', res.data.user.username);
      setToken(res.data.token);
      setUser(res.data.user);
      window.location.href = '/wardrobe';
    } catch (err) {
      setError('Registration failed: ' + (err.response?.data || err.message));
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h2 className="text-2xl mb-4">Register</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          className="w-full p-2 mb-2 border rounded"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full p-2 mb-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="w-full p-2 mb-2 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-green-500 text-white p-2 rounded"
        >
          Register
        </button>
      </form>
      <p className="mt-4">
        Already have an account?{' '}
        <a href="/login" className="text-blue-500">
          Login
        </a>
      </p>
    </div>
  );
}

function Login({ setUser, setToken }) {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/auth/login/`, formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('username', res.data.user.username);
      setToken(res.data.token);
      setUser(res.data.user);
      window.location.href = '/wardrobe';
    } catch (err) {
      setError('Login failed: ' + (err.response?.data || err.message));
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h2 className="text-2xl mb-4">Login</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          className="w-full p-2 mb-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="w-full p-2 mb-2 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          Login
        </button>
      </form>
      <p className="mt-4">
        New user?{' '}
        <a href="/register" className="text-green-500">
          Register
        </a>
      </p>
    </div>
  );
}

function Wardrobe({ user }) {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    condition: 'good',
    category: 'mixed',
    location: '',
    image: null,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await axios.get(`${API_BASE}/listings/`);
        setListings(res.data);
      } catch (err) {
        console.error('Error fetching wardrobe:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('description', formData.description);
    submitData.append('condition', formData.condition);
    submitData.append('category', formData.category);
    if (formData.location) submitData.append('location', formData.location);
    if (formData.image) submitData.append('image', formData.image);

    try {
      await axios.post(`${API_BASE}/listings/`, submitData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setFormData({
        title: '',
        description: '',
        condition: 'good',
        category: 'mixed',
        location: '',
        image: null,
      });
      const res = await axios.get(`${API_BASE}/listings/`);
      setListings(res.data);
    } catch (err) {
      console.error('Error creating listing:', err);
      alert('Failed to create listing: ' + (err.response?.data || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  if (loading) return <div className="p-8">Loading wardrobe...</div>;

  return (
    <div className="p-8">
      <h2 className="text-2xl mb-4">Your Wardrobe, {user.username}</h2>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow mb-6"
      >
        <h3 className="text-lg mb-4">Add New Item</h3>

        <input
          type="text"
          placeholder="Title (e.g., Blue Jeans)"
          value={formData.title}
          onChange={(e) =>
            setFormData({ ...formData, title: e.target.value })
          }
          className="w-full p-2 mb-2 border rounded"
          required
        />

        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="w-full p-2 mb-2 border rounded"
          rows="3"
        />

        <select
          value={formData.condition}
          onChange={(e) =>
            setFormData({ ...formData, condition: e.target.value })
          }
          className="w-full p-2 mb-2 border rounded"
        >
          {['new', 'like_new', 'good', 'fair'].map((c) => (
            <option key={c} value={c}>
              {c.replace('_', ' ').toUpperCase()}
            </option>
          ))}
        </select>

        <select
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
          className="w-full p-2 mb-2 border rounded"
        >
          {['cotton', 'synthetic', 'mixed'].map((c) => (
            <option key={c} value={c}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Location (lon,lat e.g., -74.006,40.7128)"
          value={formData.location}
          onChange={(e) =>
            setFormData({ ...formData, location: e.target.value })
          }
          className="w-full p-2 mb-2 border rounded"
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full p-2 mb-2 border rounded"
        />

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-green-500 text-white p-2 rounded disabled:opacity-50"
        >
          {submitting ? 'Adding...' : 'Add Item'}
        </button>
      </form>

      <p className="mb-4">Listings: {listings.length}</p>
      <ul className="space-y-2">
        {listings.map((item) => (
          <li
            key={item.id}
            className="bg-white p-4 rounded shadow flex items-center space-x-4"
          >
            {item.image && (
              <img
                src={`http://localhost:8000${item.image}`}
                alt={item.title}
                className="w-20 h-20 object-cover rounded"
              />
            )}
            <div>
              <strong>{item.title}</strong> -{' '}
              {item.condition.replace('_', ' ')}
              <br />
              Category: {item.category}
              <br />
              Eco Impact: {item.eco_impact.toFixed(1)} kg CO₂ saved
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}


function Listings({ user }) {
  const [allListings, setAllListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await axios.get(`${API_BASE}/public-listings/`);
        setAllListings(res.data);
      } catch (err) {
        console.error('Error fetching listings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  if (loading) return <div className="p-8">Loading listings...</div>;

  return (
    <div className="p-8">
      <h2 className="text-2xl mb-4">
        Available Swaps ({allListings.length})
      </h2>

      <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {allListings.map((item) => (
          <li key={item.id} className="bg-white p-4 rounded shadow">
            {item.image && (
              <img
                src={`http://localhost:8000${item.image}`}
                alt={item.title}
                className="w-full h-48 object-cover mb-2 rounded"
              />
            )}
            <strong>{item.title}</strong>
            <br />
            Condition: {item.condition.replace('_', ' ')}
            <br />
            Category: {item.category}
            <br />
            Eco Impact: {item.eco_impact.toFixed(1)} kg CO₂ saved
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

