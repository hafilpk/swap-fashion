import { useState, useEffect } from 'react';
import axios from 'axios';

function Inbox({ user }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`${API_BASE}/inbox/`);
        setMessages(res.data);
      } catch (err) {
        console.error('Error fetching messages:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  if (loading) return <div className="p-8">Loading inbox...</div>;

  return (
    <div className="p-8">
      <h2 className="text-2xl mb-4">Your Inbox ({messages.length} unread)</h2>

      <ul className="space-y-2">
        {messages.map((msg) => (
          <li key={msg.id} className="bg-white p-4 rounded shadow">
            <strong>From: {msg.sender_username}</strong> about{' '}
            <em>{msg.listing.title}</em>
            <br />
            {msg.content}
            <br />
            <small>{new Date(msg.created_at).toLocaleString()}</small>

            <button
              onClick={async () => {
                await axios.patch(`${API_BASE}/messages/${msg.id}/`, { is_read: true });
                window.location.reload();
              }}
              className="ml-2 text-blue-500"
            >
              Mark Read
            </button>
          </li>
        ))}
      </ul>

      {messages.length === 0 && (
        <p>No messages yet. Browse swaps to start chatting!</p>
      )}
    </div>
  );
}
export default Inbox;