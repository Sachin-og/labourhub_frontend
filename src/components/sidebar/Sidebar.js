import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Sidebar = ({ currentUserId }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchQuery) {
      // Fetch users based on the search query
      axios.get(`/users/search?query=${searchQuery}`)
        .then(response => {
          setUsers(response.data);
        })
        .catch(error => console.error(error));
    } else {
      setUsers([]);
    }
  }, [searchQuery]);

  const handleUserClick = (receiverId) => {
    navigate(`/chat/${receiverId}`);
  };

  return (
    <div style={{ width: '300px', padding: '10px', background: '#f4f4f4' }}>
      <h3>Search Users</h3>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search by name"
        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
      />
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {users.map(user => (
          <li
            key={user.id}
            onClick={() => handleUserClick(user.id)}
            style={{
              padding: '10px',
              cursor: 'pointer',
              background: '#fff',
              marginBottom: '5px',
              borderRadius: '5px',
            }}
          >
            {user.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
