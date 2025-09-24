import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8000';

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <div className="min-h-screen bg-green-50">
        <header className="bg-green-600 text-white p-4">
          <h1 className="text-2xl">Sustainable Fashion Swap</h1>
        </header>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/wardrobe" element={<Wardrobe user={user} />} />
          <Route path="/listings" element={<Listings user={user} />} />
        </Routes>
      </div>
    </Router>
  );
}

function Home() {
  return (
    <div className="p-8">
      Welcome!{" "}
      <a href="/login" className="text-blue-500">
        Login
      </a>{" "}
      to start swapping.
    </div>
  );
}

function Login({ setUser }) {
  const handleLogin = async () => {
    // Placeholder. Implement auth later
    setUser({ username: 'demo' });
  };

  return (
    <div className="p-8">
      <button
        onClick={handleLogin}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Demo Login
      </button>
    </div>
  );
}

function Wardrobe({ user }) {
  return user ? (
    <div className="p-8">Your Wardrobe (Coming soon)</div>
  ) : (
    <div>Please log in.</div>
  );
}

function Listings({ user }) {
  return user ? (
    <div className="p-8">Browse Swaps (Coming soon)</div>
  ) : (
    <div>Please log in.</div>
  );
}

export default App;
