import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';
import { getOpenPosts, getAllPosts, getClosedPosts, deletePost, editPost } from '../../api/axios'; // Import API functions

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // State for the filter (All, Open, Closed)

  // State for Edit Dialog
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    const fetchPostsForUser = async () => {
      const userId = sessionStorage.getItem('userid');
      if (!userId) {
        setError('User ID is not available');
        setLoading(false);
        return;
      }

      try {
        const postsData = await getAllPosts(userId);
        // Filter posts based on selected filter
        const filteredPosts = postsData.filter((post) => {
          if (filter === 'all') return true;
          if (filter === 'open') return post.isopened;
          if (filter === 'closed') return !post.isopened;
          return false;
        });
        setPosts(filteredPosts);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Error fetching posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPostsForUser();
  }, [filter]); // Re-fetch posts when filter changes

  const handleDeletePost = async (id) => {
    try {
      await deletePost(id);
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === id ? { ...post, isopened: false } : post
        )
      );
    } catch (err) {
      console.error('Error closing post:', err);
      setError('Error closing the post');
    }
  };

  const handleOpenEditDialog = (post) => {
    setSelectedPost(post);
    setEditData({ ...post });
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedPost(null);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const handleToggleIsOpened = (e) => {
    setEditData({ ...editData, isopened: e.target.checked });
  };

  const handleSubmitEdit = async () => {
    try {
      await editPost(selectedPost.id, editData);
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === selectedPost.id ? { ...post, ...editData } : post
        )
      );
      handleCloseEditDialog();
    } catch (err) {
      console.error('Error editing post:', err);
      setError('Error updating the post');
    }
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
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
    <Box sx={{ p: 2, mt: 10 }}>
      {/* Filter Dropdown */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
        <FormControl fullWidth sx={{ width: 200 }}>
          <InputLabel>Filter</InputLabel>
          <Select value={filter} onChange={handleFilterChange} label="Filter">
            <MenuItem value="all">All Posts</MenuItem>
            <MenuItem value="open">Open Posts</MenuItem>
            <MenuItem value="closed">Closed Posts</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        {posts.map((post) => (
          <Grid item xs={12} sm={6} md={4} key={post.id}>
            <Card
              sx={{
                maxWidth: 345,
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                borderRadius: 2,
                overflow: 'hidden',
              }}
            >
              {post.jobimage && (
                <CardMedia
                  component="img"
                  height="200"
                  image={post.jobimage}
                  alt="Job Post"
                  sx={{ objectFit: 'cover' }}
                />
              )}
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {post.typeofwork}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {post.content}
                </Typography>
                <Typography variant="body2">
                  <a
                    href={post.location}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'inherit', textDecoration: 'underline' }}
                  >
                    Location
                  </a>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Duration:</strong> {post.durationofwork}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Open:</strong> {post.isopened ? 'Yes' : 'No'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Accepted:</strong> {post.isaccepted ? 'Yes' : 'No'}
                </Typography>

                {/* Conditionally Render "Close Post" Button */}
                {post.isopened && (
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    sx={{ mt: 2, mr: 1 }}
                    onClick={() => handleDeletePost(post.id)}
                  >
                    Close Post
                  </Button>
                )}

                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  sx={{ mt: 2 }}
                  onClick={() => handleOpenEditDialog(post)}
                >
                  Edit Post
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Edit Dialog */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <DialogTitle>Edit Post</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Content"
            name="content"
            value={editData.content || ''}
            onChange={handleEditInputChange}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Location"
            name="location"
            value={editData.location || ''}
            onChange={handleEditInputChange}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Type of Work"
            name="typeofwork"
            value={editData.typeofwork || ''}
            onChange={handleEditInputChange}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Duration of Work"
            name="durationofwork"
            value={editData.durationofwork || ''}
            onChange={handleEditInputChange}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={editData.isopened || false}
                onChange={handleToggleIsOpened}
                name="isopened"
              />
            }
            label="Open"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmitEdit} color="primary" variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Feed;
