import { useState, useEffect } from "react";
import axios from "axios";

function Listings({ user, apiBase }) {
  const [allListings, setAllListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [error, setError] = useState("");
  const [geoError, setGeoError] = useState("");

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
          setGeoError("");
        },
        (err) => {
          console.error("Geolocation error:", err);
          setGeoError("Location access denied. Showing all public listings.");
          setError("");
        }
      );
    } else {
      setGeoError("Geolocation not supported. Showing all public listings.");
    }
  }, []);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      setError("");
      try {
        let url = `${apiBase}/public-listings/`;
        if (userLocation) {
          url = `${apiBase}/nearby-listings/?lat=${userLocation.lat}&lon=${userLocation.lon}&radius=10`;
        }
        const res = await axios.get(url);
        setAllListings(res.data);
      } catch (err) {
        console.error("Error fetching listings:", err);
        setError("Failed to load listings: " + (err.response?.data?.detail || err.message));
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, [userLocation, apiBase]);

  const handleMessage = async (listingId) => {
    const content = prompt("Enter your message:");
    if (!content || content.trim() === "") return;
    try {
      await axios.post(`${apiBase}/messages/`, {
        listing: listingId,
        content: content,
      });
      alert("Message sent! Check your inbox.");
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Failed to send message: " + (err.response?.data?.detail || err.message));
    }
  };

  if (loading) return <div className="p-5 text-center">Loading swaps...</div>;
  if (error) return <div className="alert alert-danger m-3 text-center">{error}</div>;

  return (
    <div className="container py-4">
      <h2 className="mb-4">
        Fashion Items{" "}
        <small className="text-muted">
          ({allListings.length} {userLocation ? "within 10km" : "in all areas"})
        </small>
      </h2>

      {geoError && <div className="alert alert-warning">{geoError}</div>}

      {userLocation && (
        <p className="text-muted mb-3">
          Your location: {userLocation.lat.toFixed(4)}, {userLocation.lon.toFixed(4)}
        </p>
      )}

      <div className="row">
        {allListings.map((item) => (
          <div key={item.id} className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm">
              {item.image && (
                <img
                  src={`http://localhost:8000${item.image}`}
                  alt={item.title}
                  className="card-img-top"
                  style={{ objectFit: "cover", height: "200px" }}
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              )}
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{item.title}</h5>
                <h6 className="card-subtitle mb-2 text-muted">👤 {item.owner_username}</h6>

                <p className="card-text mb-2">
                  <strong>Condition:</strong> {item.condition?.replace("_", " ") || "Unknown"} <br />
                  <strong>Category:</strong> {item.category || "General"} <br />
                  <strong>Location:</strong> {item.location_coords || "Not specified"} <br />
                  <strong>Eco Impact:</strong> {item.eco_impact?.toFixed(1) || "0"} kg CO₂ saved
                </p>

                {userLocation && item.distance && (
                  <p className="text-muted mb-2">
                    Distance: {item.distance.km?.toFixed(1) || item.distance?.toFixed(1)} km
                  </p>
                )}

                <button
                  onClick={() => handleMessage(item.id)}
                  className="btn btn-primary mt-auto"
                >
                  Send Message
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {allListings.length === 0 && !loading && (
        <div className="text-center text-muted mt-4">
          No swaps available. <br /> Add one to your wardrobe or broaden your search!
        </div>
      )}
    </div>
  );
}

export default Listings;
