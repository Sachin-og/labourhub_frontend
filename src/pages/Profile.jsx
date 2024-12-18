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
import CreatePost from './CreatePost';
import EditProfile from './EditProfile';

const Profile = () => {
  const [profile, setProfile] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
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
  
  

 
  return (
    <Container maxWidth="lg" sx={{ mt: 13 }}>
      <Card elevation={3} sx={{ p: 3 }}>
        {/* Header Section */}
        <Box display="flex" alignItems="center" gap={3}>
          <Avatar
            src={profile.profilePicture || '/default-profile.png'}
            alt="Profile Picture"
            sx={{ width: 150, height: 150 }}
          />
          <Box>
            <Typography variant="h4" fontWeight="bold">
              {profile.name || 'Your Name'}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {profile.city || 'Your City'}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              {profile.bio || 'Tell us about yourself'}
            </Typography>
          </Box>
          <Box flexGrow={1} display="flex" justifyContent="flex-end">
         <CreatePost />
        <EditProfile />
          

            
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Main Sections */}
        
          <Grid container spacing={4}>
            {/* Left Column */}
            <Grid item xs={12} md={8}>
              <Typography variant="h6" fontWeight="bold">
                Skills
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {profile.skills || 'Your skills will be listed here.'}
              </Typography>

              <Typography variant="h6" fontWeight="bold">
                Experience
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {profile.experience && profile.experience.length > 0
                  ? profile.experience.map((exp, index) => (
                      <Box key={index}>
                        <Typography>
                          {exp.company} - {exp.role} ({exp.startDate} - {exp.endDate})
                        </Typography>
                      </Box>
                    ))
                  : 'Add your professional experience.'}
              </Typography>

              <Typography variant="h6" fontWeight="bold">
                Education
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {profile.education && profile.education.length > 0
                  ? profile.education.map((edu, index) => (
                      <Box key={index}>
                        <Typography>
                          {edu.institution} - {edu.degree} ({edu.startDate} - {edu.endDate})
                        </Typography>
                      </Box>
                    ))
                  : 'Add your education details.'}
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                Certifications
              </Typography>
              {profile.certifications && profile.certifications.length > 0
                ? profile.certifications.map((cert, index) => (
                    <Box key={index}>
                      <Typography>
                        {cert.certificationName} - {cert.institution} ({cert.issueDate})
                      </Typography>
                    </Box>
                  ))
                : 'Add your certifications here'
                }

            </Grid>

            {/* Right Column */}
            <Grid item xs={12} md={4}>
              <Typography variant="h6" fontWeight="bold">
                Contact Information
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <strong>Email:</strong> {profile.email || 'Your Email'}
              </Typography>
              <Box mt={2}>
                <Typography variant="h6" fontWeight="bold">
                  Social Links
                </Typography>
                {profile.linkedin && (
                  <Link href={profile.linkedin} target="_blank" rel="noopener" underline="hover">
                    LinkedIn
                  </Link>
                )}
                <br />
                {profile.github && (
                  <Link href={profile.github} target="_blank" rel="noopener" underline="hover">
                    GitHub
                  </Link>
                )}
                <br />
                {profile.website && (
                  <Link href={profile.website} target="_blank" rel="noopener" underline="hover">
                    Website
                  </Link>
                )}
              </Box>
            </Grid>
          </Grid>
        
        
      </Card>

      {/* Snackbar for Notifications */}
      <Snackbar
        open={Boolean(error || success)}
        autoHideDuration={6000}
        onClose={() => {
          setError('');
          setSuccess('');
        }}
      >
        <Alert
          onClose={() => {
            setError('');
            setSuccess('');
          }}
          severity={error ? 'error' : 'success'}
          sx={{ width: '100%' }}
        >
          {error || success}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Profile;
