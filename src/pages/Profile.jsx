import React, { useState, useEffect } from 'react';
import axios from '../api/axios'; // Your Axios instance
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Avatar,
  Paper,
  Grid,
  IconButton,
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';

const Profile = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    location: '',
    education: '',
    experience: '',
    skills: '',
    bio: '',
    profilePicture: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch user profile data
    const fetchProfile = async () => {
      try {
        const response = await axios.get('/users/profile');
        setProfile(response.data);
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfile((prevState) => ({
        ...prevState,
        profilePicture: reader.result, // Base64 string
      }));
    };
    if (file) reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      const response = await axios.put('/users/profile', profile);
      setSuccess('Profile updated successfully!');
      setError('');
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err.response || err.message);
      setError('Failed to update profile.');
    }
  };

  return (
    <Container component="main" maxWidth="md">
      <Paper
        elevation={3}
        sx={{
          mt: 4,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderRadius: 2,
        }}
      >
        <Typography component="h1" variant="h5">
          User Profile
        </Typography>
        <Avatar
          src={profile.profilePicture}
          alt="Profile Picture"
          sx={{ width: 100, height: 100, mt: 2 }}
        />
        {isEditing && (
          <IconButton color="primary" component="label">
            <PhotoCamera />
            <input hidden accept="image/*" type="file" onChange={handleImageChange} />
          </IconButton>
        )}
        <Box
          component="form"
          noValidate
          sx={{ mt: 2, width: '100%' }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="name"
                label="Full Name"
                fullWidth
                value={profile.name}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="email"
                label="Email"
                fullWidth
                value={profile.email}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="location"
                label="Location"
                fullWidth
                value={profile.location}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="education"
                label="Education"
                fullWidth
                multiline
                rows={3}
                value={profile.education}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="experience"
                label="Work Experience"
                fullWidth
                multiline
                rows={3}
                value={profile.experience}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="skills"
                label="Skills"
                fullWidth
                value={profile.skills}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="bio"
                label="Bio"
                fullWidth
                multiline
                rows={4}
                value={profile.bio}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </Grid>
          </Grid>
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            {isEditing ? (
              <Button variant="contained" color="primary" onClick={handleSave}>
                Save
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </Button>
            )}
          </Box>
          {success && <Typography color="green">{success}</Typography>}
          {error && <Typography color="red">{error}</Typography>}
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile;
