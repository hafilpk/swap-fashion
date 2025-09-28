import { useState, useEffect } from 'react';
import axios from 'axios';

function Inbox({ user, apiBase }) { 
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        console.log('Fetching messages from:', `${apiBase}/inbox/`);
        const res = await axios.get(`${apiBase}/inbox/`);
        console.log('Messages response:', res.data);
        setMessages(res.data);
        setError('');
      } catch (err) {
        console.error('Error fetching messages:', err);
        setError('Failed to load messages: ' + (err.response?.data?.detail || err.message));
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [apiBase]);

  const handleMarkRead = async (msgId) => {
    try {
      console.log('Marking message as read:', msgId);
      await axios.patch(`${apiBase}/messages/${msgId}/`, { is_read: true });
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === msgId ? { ...msg, is_read: true } : msg
        )
      );

      console.log('Message marked as read successfully');
    } catch (err) {
      console.error('Error marking message as read:', err);
      setError('Failed to mark as read: ' + (err.response?.data?.detail || err.message));
    }
  };

  if (loading) return <div className="p-8">Loading inbox...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="p-8">
      <h2 className="text-2xl mb-4">Your Inbox ({messages.filter((msg) => !msg.is_read).length} unread)</h2>  {/* IMPROVED: Count only unread */}

      <ul className="space-y-2">
        {messages.map((msg) => (
          <li key={msg.id} className="bg-white p-4 rounded shadow">
            <strong>From: {msg.sender_username}</strong> about{' '}
            <em>{msg.listing?.title || 'a listing'}</em>
            <br />
            {msg.content}
            <br />
            <small>{new Date(msg.created_at).toLocaleString()}</small>
            {!msg.is_read && (
              <button
                onClick={() => handleMarkRead(msg.id)}
                className="ml-2 text-blue-500 hover:underline"
              >
                Mark Read
              </button>
            )}
            {msg.is_read && <small className="ml-2 text-gray-500">(Read)</small>}
          </li>
        ))}
      </ul>

      {messages.length === 0 && !loading && (
        <p className="text-gray-500">No messages yet. Browse swaps to start chatting!</p>
      )}
    </div>
  );
}

export default Inbox;
