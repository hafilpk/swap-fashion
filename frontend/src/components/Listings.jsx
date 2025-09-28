import { useState, useEffect } from 'react';
import axios from 'axios';

function Listings({ user }) {
  const [allListings, setAllListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (err) => {
          setError('Location access denied. Showing all public listings.');
          console.error('Geolocation error:', err);
        }
      );
    } else {
      setError('Geolocation not supported.');
    }
  }, []);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        let url = `${API_BASE}/public-listings/`;
        if (userLocation) {
          url = `${API_BASE}/nearby-listings/?lat=${userLocation.lat}&lon=${userLocation.lon}&radius=10`;
        }
        const res = await axios.get(url);
        setAllListings(res.data);
      } catch (err) {
        console.error('Error fetching listings:', err);
        setError('Failed to load listings.');
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, [userLocation]);

  const handleMessage = async (listingId) => {
    const content = prompt('Enter your message:');
    if (!content) return;
    try {
      await axios.post(`${API_BASE}/messages/`, {
        listing: listingId,
        content: content,
      });
      alert('Message sent!');
    } catch (err) {
      alert('Failed to send message: ' + err.message);
    }
  };

  if (loading) return <div className="p-8">Loading nearby swaps...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="p-8">
      <h2 className="text-2xl mb-4">
        Nearby Swaps ({allListings.length} within {userLocation ? '10km' : 'all areas'})
      </h2>

      {userLocation && (
        <p className="mb-4 text-sm">
          Your location: {userLocation.lat.toFixed(4)}, {userLocation.lon.toFixed(4)}
        </p>
      )}

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

            <strong>{item.title}</strong> by {item.owner_username}
            <br />
            Condition: {item.condition.replace('_', ' ')} | Category: {item.category}
            <br />
            Location: {item.location_coords || 'Not specified'}
            <br />
            Eco Impact: {item.eco_impact.toFixed(1)} kg CO₂ saved
            <br />

            {userLocation && item.distance && (
              <span className="text-sm text-gray-600">
                Distance: {item.distance.km.toFixed(1)} km
              </span>
            )}

            <button
              onClick={() => handleMessage(item.id)}
              className="mt-2 w-full bg-blue-500 text-white p-2 rounded"
            >
              Send Message
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default Listings;