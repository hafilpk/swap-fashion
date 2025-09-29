import { useState, useEffect } from 'react';
import axios from 'axios';

function Inbox({ user, apiBase }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`${apiBase}/inbox/`);
        setMessages(res.data);
        setError('');
      } catch (err) {
        setError('Failed to load messages: ' + (err.response?.data?.detail || err.message));
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [apiBase]);

  const handleMarkRead = async (msgId) => {
    try {
      await axios.patch(`${apiBase}/messages/${msgId}/`, { is_read: true });
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === msgId ? { ...msg, is_read: true } : msg
        )
      );
    } catch (err) {
      setError('Failed to mark as read: ' + (err.response?.data?.detail || err.message));
    }
  };

  if (loading) return <div className="text-center py-5">Loading inbox...</div>;
  if (error) return <div className="alert alert-danger text-center">{error}</div>;

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">
          Your Inbox{' '}
          <span className="badge bg-warning text-dark">
            {messages.filter((msg) => !msg.is_read).length} unread
          </span>
        </h2>
      </div>

      {messages.length === 0 ? (
        <div className="alert alert-info text-center">
          No messages yet. Browse swaps to start chatting!
        </div>
      ) : (
        <div className="row g-3">
          {messages.map((msg) => (
            <div key={msg.id} className="col-12">
              <div className={`card shadow-sm ${msg.is_read ? 'border-light' : 'border-success border-2'}`}>
                <div className="card-body">
                  <h5 className="card-title mb-1">
                    From <span className="text-success">{msg.sender_username}</span>
                  </h5>
                  <h6 className="card-subtitle mb-2 text-muted">
                    Regarding: {msg.listing?.title || 'a listing'}
                  </h6>
                  <p className="card-text">{msg.content}</p>
                  <small className="text-muted">
                    {new Date(msg.created_at).toLocaleString()}
                  </small>
                  <div className="mt-3">
                    {!msg.is_read ? (
                      <button
                        onClick={() => handleMarkRead(msg.id)}
                        className="btn btn-sm btn-outline-success"
                      >
                        Mark as Read
                      </button>
                    ) : (
                      <span className="badge bg-secondary">Read</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Inbox;
