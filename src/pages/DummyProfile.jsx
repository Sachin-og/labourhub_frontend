import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserById } from '../api/axios'; // Import the Axios function
import { Container, Typography, Box, Avatar, Button, CircularProgress } from '@mui/material';
import { styled } from '@mui/system';

// Styled components for the profile layout
const ProfileContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
}));

const ProfileDetails = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  maxWidth: 800,
  width: '100%',
}));

const ProfilePicture = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(15),
  height: theme.spacing(15),
  marginBottom: theme.spacing(2),
}));

const DummyProfile = () => {
  const { userId } = useParams(); // Extract userId from the URL
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true); // Start loading
        const userData = await getUserById(userId); // Fetch user data using userId
        setUserProfile(userData);
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError('Failed to load user data. Please try again.');
      } finally {
        setLoading(false); // End loading
      }
    };

    if (userId) fetchUserProfile();
  }, [userId]);

  const handleBack = () => {
    navigate('/users'); // Navigate back to the users list or search page
  };

  const handleChat = () => {
    navigate(`/chat/${userId}`); // Navigate to the chat screen with this user
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" marginTop={4}>
        <Typography variant="h6" color="error" gutterBottom>
          {error}
        </Typography>
        <Button variant="contained" color="primary" onClick={handleBack}>
          Back to Search
        </Button>
      </Box>
    );
  }

  return (
    <ProfileContainer>
      <ProfilePicture src={userProfile.profilePicture || '/default-profile.jpg'} alt={userProfile.name} />
      <ProfileDetails>
        <Typography variant="h4" gutterBottom>
          {userProfile.name}
        </Typography>
        <Typography variant="h6" color="textSecondary" gutterBottom>
          {userProfile.email}
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>Bio:</strong> {userProfile.bio || 'No bio available'}
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>Skills:</strong> {userProfile.skills || 'No skills listed'}
        </Typography>
        <Box display="flex" justifyContent="center" marginTop={2}>
          <Button variant="contained" color="primary" onClick={handleChat}>
            Chat with {userProfile.name}
          </Button>
        </Box>
        <Box display="flex" justifyContent="center" marginTop={2}>
          <Button variant="contained" color="primary" onClick={handleBack}>
            Back to Search
          </Button>
        </Box>
      </ProfileDetails>
    </ProfileContainer>
  );
};

export default DummyProfile;
