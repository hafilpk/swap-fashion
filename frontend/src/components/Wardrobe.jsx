import { useState, useEffect } from 'react';
import axios from 'axios';

function Wardrobe({ user, apiBase }) {
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
  const [error, setError] = useState(''); 

  useEffect(() => {
    const fetchListings = async () => {
      try {
        console.log('Fetching wardrobe from:', `${apiBase}/listings/`);
        const res = await axios.get(`${apiBase}/listings/`);
        console.log('Wardrobe response:', res.data); 
        setListings(res.data);
        setError('');
      } catch (err) {
        console.error('Error fetching wardrobe:', err);
        setError('Failed to load wardrobe: ' + (err.response?.data?.detail || err.message));  // IMPROVED: UI error
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, [apiBase]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('description', formData.description);
    submitData.append('condition', formData.condition);
    submitData.append('category', formData.category);
    if (formData.location) submitData.append('location', formData.location);
    if (formData.image) submitData.append('image', formData.image);

    try {
      console.log('Creating listing with data:', Object.fromEntries(submitData));  // TEMP DEBUG (FormData log)
      const res = await axios.post(`${apiBase}/listings/`, submitData, {  // FIXED: Use apiBase prop
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('New listing created:', res.data);
      setListings((prev) => [...prev, res.data]);

      setFormData({
        title: '',
        description: '',
        condition: 'good',
        category: 'mixed',
        location: '',
        image: null,
      });

    } catch (err) {
      console.error('Error creating listing:', err);
      setError('Failed to create listing: ' + (err.response?.data?.detail || err.response?.data || err.message));  // IMPROVED: DRF-specific
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  if (loading) return <div className="p-8">Loading wardrobe...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

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
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            )}
            <div>
              <strong>{item.title}</strong> -{' '}
              {item.condition?.replace('_', ' ') || 'Unknown'}
              <br />
              Category: {item.category || 'General'}
              <br />
              Eco Impact: {item.eco_impact?.toFixed(1) || '0'} kg CO₂ saved  
            </div>
          </li>
        ))}
      </ul>

      {listings.length === 0 && !loading && (
        <p className="text-gray-500 mt-4">No items yet. Add one to start swapping!</p>  
      )}
    </div>
  );
}

export default Wardrobe;
