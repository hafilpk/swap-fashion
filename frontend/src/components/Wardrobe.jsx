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
        const res = await axios.get(`${apiBase}/listings/`);
        setListings(res.data);
        setError('');
      } catch (err) {
        setError('Failed to load wardrobe: ' + (err.response?.data?.detail || err.message));
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
    if (formData.location) submitData.append('location', formData.location);
    if (formData.image) submitData.append('image', formData.image);

    try {
      const res = await axios.post(`${apiBase}/listings/`, submitData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setListings((prev) => [...prev, res.data]);

      setFormData({
        title: '',
        description: '',
        condition: 'good',
        location: '',
        image: null,
      });
    } catch (err) {
      setError('Failed to create listing: ' + (err.response?.data?.detail || err.response?.data || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  if (loading) return <div className="container py-5">Loading wardrobe...</div>;
  if (error) return <div className="container py-5 text-danger">{error}</div>;

  return (
    <div className="container py-5">
      <h2 className="mb-4">Your Wardrobe, {user.username}</h2>
      <div className="card shadow-sm mb-5">
        <div className="card-body">
          <h4 className="card-title mb-3">Add New Item</h4>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Title</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g., Blue Jeans"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                rows="3"
                placeholder="Describe the item"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              ></textarea>
            </div>

            <div className="mb-3">
              <label className="form-label">Condition</label>
              <select
                className="form-select"
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
              >
                {['new', 'like_new', 'good', 'fair'].map((c) => (
                  <option key={c} value={c}>
                    {c.replace('_', ' ').toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Location</label>
              <input
                type="text"
                className="form-control"
                placeholder="Longitude,Latitude (e.g., -74.006,40.7128)"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Upload Image</label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>

            <button type="submit" className="btn btn-success w-100" disabled={submitting}>
              {submitting ? 'Adding...' : 'Add Item'}
            </button>
          </form>
        </div>
      </div>

      <h4 className="mb-3">Your Listings ({listings.length})</h4>
      {listings.length === 0 ? (
        <p className="text-muted">No items yet. Add one to start swapping!</p>
      ) : (
        <div className="row">
          {listings.map((item) => (
            <div className="col-md-4 mb-4" key={item.id}>
              <div className="card h-100 shadow-sm">
                {item.image && (
                  <img
                    src={`http://localhost:8000${item.image}`}
                    alt={item.title}
                    className="card-img-top"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                )}
                <div className="card-body">
                  <h5 className="card-title">{item.title}</h5>
                  <p className="card-text">
                    <strong>Condition:</strong> {item.condition?.replace('_', ' ')}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Wardrobe;
