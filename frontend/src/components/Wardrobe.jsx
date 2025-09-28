import { useState, useEffect } from 'react';
import axios from 'axios';

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
export default Wardrobe;