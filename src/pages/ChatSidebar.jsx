import React, { useEffect, useState } from 'react';
import { fetchRecentChats, getUserById, getUsers, fetchUnreadMessages } from '../api/axios';
import { io } from 'socket.io-client'; // Import Socket.IO client
import './ChatSidebar.css';
import { TextField, Paper, List, ListItem, ListItemAvatar, ListItemText, Avatar } from '@mui/material';

const ChatSidebar = ({ currentUserId, onSelectChat }) => {
  const [recentChats, setRecentChats] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [socket, setSocket] = useState(null); // Socket state
  const [unreadMessages, setUnreadMessages] = useState({}); // Track unread messages for each chat
  const [currentUser, setCurrentUser] = useState(null); // To store logged-in user info

  useEffect(() => {
    const fetchChats = async () => {
      try {
        setLoading(true);
        const userIds = await fetchRecentChats(currentUserId);
        const userDetailsPromises = userIds.map((id) => getUserById(id));
        const userDetails = await Promise.all(userDetailsPromises);
        setRecentChats(userDetails);

        const users = await getUsers();
        setAllUsers(users);

        // Fetch unread messages count for each user
        const unreadCounts = await fetchUnreadMessages(currentUserId);
        setUnreadMessages(unreadCounts);

        // Fetch logged-in user details
        const loggedInUser = await getUserById(currentUserId);
        setCurrentUser(loggedInUser);
      } catch (err) {
        setError('Failed to fetch recent chats or users.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();

    // Set up Socket.IO client
    const newSocket = io('http://localhost:5000'); // Update with your server URL
    setSocket(newSocket);

    newSocket.on('receive_message', (message) => {
      // Update recent chats with the new message
      setRecentChats((prevChats) => {
        const existingChat = prevChats.find((chat) => chat.id === message.sender_id || chat.id === message.receiver_id);
        if (existingChat) {
          return prevChats.map((chat) =>
            chat.id === existingChat.id ? { ...chat, lastMessage: message.content } : chat
          );
        } else {
          return [...prevChats, message];
        }
      });

      // Update unread message count if the message is not from the current user
      if (message.receiver_id === currentUserId) {
        setUnreadMessages((prevUnreadMessages) => {
          const updatedUnreadMessages = { ...prevUnreadMessages };
          updatedUnreadMessages[message.sender_id] = (updatedUnreadMessages[message.sender_id] || 0) + 1;
          return updatedUnreadMessages;
        });
      }
    });

    return () => newSocket.disconnect();
  }, [currentUserId]);

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query.trim() === '') {
      setFilteredUsers([]);
      return;
    }

    const filtered = allUsers.filter((user) =>
      user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query)
    );
    setFilteredUsers(filtered);
  };

  if (loading) return <div>Loading chats...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="chat-sidebar">
      {/* Display the logged-in user's name and profile picture at the top */}
      {currentUser && (
        <div className="user-info">
          <Avatar src={currentUser.profilePicture || '/default-avatar.png'} sx={{ width: 60, height: 60 }} />
          <h3>{currentUser.name}</h3>
        </div>
      )}

      <TextField
        label="Search for users"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={handleSearchChange}
        autoComplete="off"
        sx={{ mb: 2 }}
      />
      
      {/* Search results */}
      {filteredUsers.length > 0 && (
        <Paper elevation={3} sx={{ maxHeight: 300, overflowY: 'auto', zIndex: 10 }}>
          <List>
            {filteredUsers.map((user) => (
              <ListItem key={user.id} button onClick={() => onSelectChat(user.id)}>
                <ListItemAvatar>
                  <Avatar src={user.profilePicture || '/default-avatar.png'} />
                </ListItemAvatar>
                <ListItemText primary={user.name} secondary={user.email} />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {/* Chats list */}
      <ul className="chat-list">
        {recentChats.map((user) => {
          const unreadCount = unreadMessages[user.id] || 0; // Get unread messages count for this user

          const handleChatClick = () => {
            onSelectChat(user.id); // Select the chat
            // Reset unread messages count for the clicked user
            setUnreadMessages((prevUnreadMessages) => {
              const updatedUnreadMessages = { ...prevUnreadMessages };
              updatedUnreadMessages[user.id] = 0; // Set unread count to 0
              return updatedUnreadMessages;
            });
          };

          return (
            <li key={user.id} className="chat-item" onClick={handleChatClick}>
              <div className="chat-avatar">
                <img src={user.profilePicture || '/default-avatar.png'} alt="Avatar" />
              </div>
              <div className="chat-details">
                <p className="chat-name">{user.name}</p>
                <p
                  className={`chat-status ${unreadCount > 0 ? 'bold-text' : ''}`}
                >
                  {unreadCount > 0
                    ? `${unreadCount} new ${unreadCount === 1 ? 'message' : 'messages'}`
                    : 'Online'}
                </p>
                <p className="last-message">{user.lastMessage}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ChatSidebar;
