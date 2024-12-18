import React, { useEffect, useState } from 'react';
import {
  Box,
  TextField,
  Typography,
  Avatar,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getUsers , getRecentPosts } from '../api/axios'; // Import the API to fetch users
import FeedPost from '../components/Post/FeedPost';

const Home = () => {
  const [users, setUsers] = useState([]); // State for the list of users
  const [filteredUsers, setFilteredUsers] = useState([]); // State for search results
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(''); // State for search input
  const [error, setError] = useState('');
  const [posts, setPosts] = useState([]); 
  const navigate = useNavigate();

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (err) {
        console.error(err);
        setError('Error fetching users.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getRecentPosts(); // Fetch recent posts
        setPosts(data); // Set posts in the state
      } catch (err) {
        setError('Error fetching posts');
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    };

    fetchPosts();
  }, []);

  // Handle search input changes
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query.trim() === '') {
      setFilteredUsers([]); // Reset the dropdown when the search bar is empty
      return;
    }

    const filtered = users.filter((user) =>
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    );

    setFilteredUsers(filtered);
  };

  // Handle navigation to a user's profile
  const handleNavigateToProfile = (userId) => {
    navigate(`/users/${userId}`);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 , mt:8}}>
      {/* Search Bar */}
      <Box position="relative" width="100%">
        <TextField
          label="Search for users by name or email"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={handleSearchChange}
          autoComplete="off"
        />

        {/* Dropdown Search Results */}
        {filteredUsers.length > 0 && (
          <Paper
            elevation={3}
            sx={{
              position: 'absolute',
              width: '100%',
              maxHeight: 300,
              overflowY: 'auto',
              zIndex: 10,
            }}
          >
            <List>
              {filteredUsers.map((user) => (
                <ListItem
                  key={user.id}
                  button
                  onClick={() => handleNavigateToProfile(user.id)} // Navigate on click
                >
                  <ListItemAvatar>
                    <Avatar src={user.profilePicture || '/static/images/avatar/1.jpg'} />
                  </ListItemAvatar>
                  <ListItemText primary={user.name} secondary={user.email} />
                </ListItem>
              ))}
            </List>
          </Paper>
        )}
      </Box>

      {/* No Results */}
      {searchQuery && filteredUsers.length === 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          No users found matching your search.
        </Typography>
      )}

      {/* Feed Post Component */}
      <Box sx={{ p: 3 }}>
      {/* Latest Job Post Section */}
      <Typography variant="h5" sx={{ mb: 2 }}>
        Latest Job Posts
      </Typography>

      {/* Map through posts and render FeedPost for each */}
      {posts.map((post) => (
        <Box key={post.id} sx={{ mt: 4 }}>
          <FeedPost postId={post.id} /> {/* Pass postId as a prop */}
        </Box>
      ))}
    </Box>
    </Box>
  );
};

export default Home;
