import React, { useState, useEffect } from 'react';
import { getProfile, updateProfile , createPost} from '../api/axios';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  TextField,
  Box,
  Snackbar,
  Alert,
  Divider,
  Link, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Checkbox
} from '@mui/material';



function CreatePost() {

    const [profile, setProfile] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [openPostDialog, setOpenPostDialog] = useState(false);
  const [postData, setPostData] = useState({
    userid:'',
    content: '',
    location: '',
    isopened: true,
    isaccepted: false,
    typeofwork: '',
    durationofwork: '',
    jobimage: '',
  });

  const navigate = useNavigate();
  // Fetch email from sessionStorage
  
  const userEmail = sessionStorage.getItem('userEmail');
  
  sessionStorage.setItem('userid', profile.id);
  sessionStorage.setItem('userId', profile.id);
  const userId = sessionStorage.getItem('userId');
  useEffect(() => {
   
    
    // Redirect to login page if 'userEmail' is not found
    if (!userEmail) {
      navigate('/');
    }
  }, [navigate]);
  // Fetch user profile on component load
  useEffect(() => {
    if (!userEmail) {
      setError('No user email found. Please log in.');
      return;
    }
  
    const fetchProfile = async () => {
      try {
        const data = await getProfile(userEmail);
        setProfile(data);
        
        setFormData({
          ...data,
          experience: data.experience || [],
          education: data.education || [],
          certifications: data.certifications || [],  // Initialize certifications
        });
      } catch (err) {
        setError(err.error || 'Failed to fetch profile');
      }
    };
  
    fetchProfile();
  }, [userEmail]);
  
  

  const handlePostInputChange = (e) => {
    setPostData({ ...postData, [e.target.name]: e.target.value });
  };

  // Handle checkbox changes for booleans
  const handleCheckboxChange = (e) => {
    setPostData({ ...postData, [e.target.name]: e.target.checked });
  };

  // Handle file upload for job image
  const handleFileChange = (e) => {
    setPostData({ ...postData, jobimage: e.target.files[0] });
  };

  // Open the "Create Post" dialog
  const handleOpenPostDialog = () => {
    setOpenPostDialog(true);
  };

  // Close the "Create Post" dialog
  const handleClosePostDialog = () => {
    setOpenPostDialog(false);
  };

  // Handle post submission
  const handleSubmitPost = async (e) => {
    e.preventDefault();
  
    // Ensure that profile is loaded and userId is available
    if (!profile.id) {
      console.error('User ID is required');
      return;
    }
  
    setLoading(true);
  
    // Prepare post data locally
    const postPayload = {
      content: postData.content,
      location: postData.location, // Ensure this is already a URL
      isopened: postData.isopened,
      isaccepted: postData.isaccepted,
      typeofwork: postData.typeofwork,
      durationofwork: postData.durationofwork,
      jobimage: postData.jobimage ? postData.jobimage : '',
      userid: profile.id, // Use profile.id directly
    };
  
    try {
      console.log('Post data being sent:', postPayload);
      // Send the data to the backend
      const response = await createPost(postPayload);
  
      console.log('Post created:', response);
  
      // Reset form fields
      setPostData({
        content: '',
        location: '',
        isopened: true,
        isaccepted: false,
        typeofwork: '',
        durationofwork: '',
        jobimage: '',
      });
  
      // Optionally close dialog
      // handleClosePostDialog();
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setLoading(false);
    }
  };
  
  
  return (
    <div>
       {/* <Box flexGrow={1} display="flex" justifyContent="flex-end"> */}
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenPostDialog}
            sx={{ marginRight: 2 }}
          >
            Create New Post
          </Button>
          <Dialog open={openPostDialog} onClose={handleClosePostDialog}>
        <DialogTitle>Create a New Post</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmitPost}>
            {/* Content Field */}
            <TextField
              label="Post Content"
              name="content"
              fullWidth
              multiline
              rows={4}
              value={postData.content}
              onChange={handlePostInputChange}
              sx={{ mb: 2 }}
              required
            />

            {/* Location Field (for simplicity, text input) */}
            <TextField
              label="Location (URL format)"
              name="location"
              fullWidth
              value={postData.location}
              onChange={handlePostInputChange}
              sx={{ mb: 2 }}
              required
            />

            {/* Type of Work Field */}
            <TextField
              label="Type of Work"
              name="typeofwork"
              fullWidth
              value={postData.typeofwork}
              onChange={handlePostInputChange}
              sx={{ mb: 2 }}
              required
            />

            {/* Duration of Work Field */}
            <TextField
              label="Duration of Work"
              name="durationofwork"
              fullWidth
              value={postData.durationofwork}
              onChange={handlePostInputChange}
              sx={{ mb: 2 }}
              required
            />

            {/* Is Open Checkbox */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={postData.isopened}
                  onChange={handleCheckboxChange}
                  name="isopened"
                />
              }
              label="Is Open"
              sx={{ mb: 2 }}
            />

            {/* Is Accepted Checkbox */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={postData.isaccepted}
                  onChange={handleCheckboxChange}
                  name="isaccepted"
                />
              }
              label="Is Accepted"
              sx={{ mb: 2 }}
            />

            {/* Job Image Upload */}
            <TextField
              label="Job Image"
              name="jobimage"
              fullWidth
              value={postData.jobimage}
              onChange={handlePostInputChange}
              sx={{ mb: 2 }}
              required
            />

            <Box display="flex" justifyContent="flex-end">
              <DialogActions>
                <Button onClick={handleClosePostDialog} color="secondary">
                  Cancel
                </Button>
                <Button type="submit" color="primary">
                  Submit Post
                </Button>
              </DialogActions>
            </Box>
            </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CreatePost
