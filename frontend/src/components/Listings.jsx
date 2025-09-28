import { useState, useEffect } from 'react';
import axios from 'axios';

function Listings({ user, apiBase }) {
  const [allListings, setAllListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [error, setError] = useState('');
  const [geoError, setGeoError] = useState('');

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
          setGeoError('');
        },
        (err) => {
          console.error('Geolocation error:', err);
          setGeoError('Location access denied. Showing all public listings.');
          setError('');
        }
      );
    } else {
      setGeoError('Geolocation not supported. Showing all public listings.');
    }
  }, []);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      setError('');
      try {
        let url = `${apiBase}/public-listings/`;
        if (userLocation) {
          url = `${apiBase}/nearby-listings/?lat=${userLocation.lat}&lon=${userLocation.lon}&radius=10`;
        }
        console.log('Fetching listings from:', url);
        const res = await axios.get(url);
        console.log('Listings response:', res.data);
        setAllListings(res.data);
      } catch (err) {
        console.error('Error fetching listings:', err);
        setError('Failed to load listings: ' + (err.response?.data?.detail || err.message));
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, [userLocation, apiBase]);

  const handleMessage = async (listingId) => {
    const content = prompt('Enter your message:');
    if (!content || content.trim() === '') return;
    try {
      console.log('Sending message for listing:', listingId, 'Content:', content);
      await axios.post(`${apiBase}/messages/`, { 
        listing: listingId,
        content: content,
      });
      console.log('Message sent successfully'); 
      alert('Message sent! Check your inbox or the recipient\'s.');
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Failed to send message: ' + (err.response?.data?.detail || err.message));
    }
  };

  if (loading) return <div className="p-8">Loading nearby swaps...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="p-8">
      <h2 className="text-2xl mb-4">
        Nearby Swaps ({allListings.length} within {userLocation ? '10km' : 'all areas'})
      </h2>

      {geoError && (
        <p className="mb-4 text-yellow-600 text-sm">{geoError}</p>
      )}

      {userLocation && (
        <p className="mb-4 text-sm text-gray-600">
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
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            )}

            <strong>{item.title}</strong> by {item.owner_username}
            <br />
            Condition: {item.condition?.replace('_', ' ') || 'Unknown'} | Category: {item.category || 'General'}
            <br />
            Location: {item.location_coords || 'Not specified'}
            <br />
            Eco Impact: {item.eco_impact?.toFixed(1) || '0'} kg CO₂ saved 
            <br />

            {userLocation && item.distance && (
              <span className="text-sm text-gray-600 block">
                Distance: {item.distance.km?.toFixed(1) || item.distance?.toFixed(1)} km 
              </span>
            )}

            <button
              onClick={() => handleMessage(item.id)}
              className="mt-2 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Send Message
            </button>
          </li>
        ))}
      </ul>

      {allListings.length === 0 && !loading && (
        <p className="text-gray-500 text-center mt-8">No swaps available. Add one to your wardrobe or try broadening your search!</p>
      )}
    </div>
  );
}

export default Listings;
