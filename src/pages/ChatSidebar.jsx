import React, { useEffect, useState } from 'react';
import { fetchRecentChats, getUserById } from '../api/axios'; // Adjust the import path
import './ChatSidebar.css'; // Add styles if needed

const ChatSidebar = ({ currentUserId, onSelectChat }) => {
  const [recentChats, setRecentChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        setLoading(true);
        // Fetch the recent chat user IDs
        const userIds = await fetchRecentChats(currentUserId);
        const userDetailsPromises = userIds.map((id) => getUserById(id));
        const userDetails = await Promise.all(userDetailsPromises);

        setRecentChats(userDetails);
      } catch (err) {
        setError('Failed to fetch recent chats.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [currentUserId]);

  if (loading) return <div>Loading chats...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="chat-sidebar">
      <h3>Chats</h3>
      <ul className="chat-list">
        {recentChats.map((user) => (
          <li
            key={user.id}
            className="chat-item"
            onClick={() => onSelectChat(user.id)}
          >
            <div className="chat-avatar">
              <img src={user.profilePicture || '/default-avatar.png'} alt="Avatar" />
            </div>
            <div className="chat-details">
              <p className="chat-name">{user.name}</p>
              <p className="chat-status">{user.status || 'Online'}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatSidebar;
