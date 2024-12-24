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



function EditProfile() {

    const [profile, setProfile] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    bio: '', // Ensure it's a string
    skills: '', // Ensure it's a string
    linkedin: '', // Ensure it's a string (URL format)
    github: '', // Ensure it's a string (URL format)
    website: '', // Ensure it's a string (URL format)
    experience: [], // Ensure it's an array
    education: [], // Ensure it's an array
    certifications: [], // Ensure it's an array
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openPostDialog, setOpenPostDialog] = useState(false);
  
  const navigate = useNavigate();
  // Fetch email from sessionStorage
  
  const userEmail = sessionStorage.getItem('userEmail');
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
  
  
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle experience and education changes
  const handleExperienceChange = (index, e) => {
    const updatedExperience = [...formData.experience];
    updatedExperience[index] = {
      ...updatedExperience[index],
      [e.target.name]: e.target.value,
    };
    setFormData({ ...formData, experience: updatedExperience });
  };

  const handleEducationChange = (index, e) => {
    const updatedEducation = [...formData.education];
    updatedEducation[index] = {
      ...updatedEducation[index],
      [e.target.name]: e.target.value,
    };
    setFormData({ ...formData, education: updatedEducation });
  };

  // Add a new experience entry
  const addExperience = () => {
    setFormData({
      ...formData,
      experience: [
        ...formData.experience,
        { company: '', role: '', startDate: '', endDate: '' },
      ],
    });
  };
  
  // Add a new education entry
  const addEducation = () => {
    setFormData({
      ...formData,
      education: [
        ...formData.education,
        { institution: '', degree: '', startDate: '', endDate: '' },
      ],
    });
  };

// Add a new certification entry
const addCertification = () => {
  setFormData({
    ...formData,
    certifications: [
      ...formData.certifications,
      { certificationName: '', institution: '', issueDate: '' },
    ],
  });
};
// Remove experience entry
const removeExperience = (index) => {
  const updatedExperience = formData.experience.filter((_, i) => i !== index);
  setFormData({ ...formData, experience: updatedExperience });
};

// Remove education entry
const removeEducation = (index) => {
  const updatedEducation = formData.education.filter((_, i) => i !== index);
  setFormData({ ...formData, education: updatedEducation });
};

// Remove certification entry
const removeCertification = (index) => {
  const updatedCertifications = formData.certifications.filter((_, i) => i !== index);
  setFormData({ ...formData, certifications: updatedCertifications });
};

// Handle certification input changes
const handleCertificationChange = (index, e) => {
  setFormData((prevFormData) => {
    const updatedCertifications = [...prevFormData.certifications];
    updatedCertifications[index] = {
      ...updatedCertifications[index],
      [e.target.name]: e.target.value,
    };
    return { ...prevFormData, certifications: updatedCertifications };
  });
};
const handleOpenPostDialog = () => {
    setOpenPostDialog(true);
  };

  // Close the "Create Post" dialog
  const handleClosePostDialog = () => {
    setOpenPostDialog(false);
    window.location.reload();
  };


  // Submit updated profile
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const cleanProfileData = (data) => {
      const cleanedData = {};
      Object.keys(data).forEach((key) => {
        if (data[key] !== null && data[key] !== '') {
          cleanedData[key] = data[key]; // Only include non-null, non-empty fields
        }
      });
      return cleanedData;
    };
    
    const updatedData = cleanProfileData({
      ...formData,
      bio: formData.bio || '', // Ensure string
      skills: formData.skills || '', // Ensure string
      linkedin: formData.linkedin || "", // Ensure valid URL or empty string
      github: formData.github || "", // Ensure valid URL or empty string
      website: formData.website || "", // Ensure valid URL or empty string
      experience: Array.isArray(formData.experience) ? formData.experience : [], // Ensure array
      education: Array.isArray(formData.education) ? formData.education : [], // Ensure array
      certifications: Array.isArray(formData.certifications) ? formData.certifications : [], // Ensure array
    });
  
    try {
      console.log('Updating Profile with Data:', updatedData);
      const updatedProfile = await updateProfile(updatedData);
      setProfile(updatedProfile); // Update the local profile state
      setSuccess('Profile updated successfully!');
      setEditMode(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Failed to update profile.');
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
            Edit Profile
          </Button>
          <Dialog open={openPostDialog} onClose={handleClosePostDialog} maxWidth="md" fullWidth>
  <DialogTitle>Edit Your Profile</DialogTitle>
  <DialogContent>
    <Grid container spacing={3}>
      {/* Left Column */}
      <Grid item xs={12} md={6}>
        <form>
          {/* General Profile Fields */}
          <TextField
            label="Name"
            name="name"
            fullWidth
            value={formData.name || ''}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
            required
          />
          <TextField
            label="Email"
            name="email"
            fullWidth
            value={formData.email || ''}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
            required
          />
          <TextField
            label="City"
            name="city"
            fullWidth
            value={formData.city || ''}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
            required
          />
          <TextField
            label="Profile Picture (URL)"
            name="profilePicture"
            fullWidth
            value={formData.profilePicture || ''}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
            required
          />
          <TextField
            label="Bio"
            name="bio"
            fullWidth
            multiline
            rows={4}
            value={formData.bio || ''}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
            required
          />
          <TextField
            label="Skills"
            name="skills"
            fullWidth
            value={formData.skills || ''}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
            required
          />
          <TextField
            label="linkedin"
            name="linkedin"
            fullWidth
            value={formData.linkedin || ''}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
            required
          />
          <TextField
            label="GitHub"
            name="github"
            fullWidth
            value={formData.github || ''}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
            required
          />
          <TextField
            label="Personal Website"
            name="website"
            fullWidth
            value={formData.website || ''}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
            required
          />
        </form>
      </Grid>

      {/* Right Column */}
      <Grid item xs={12} md={6}>
        {/* Experience Section */}
        <Typography variant="h6" gutterBottom>
          Experience
        </Typography>
        {formData.experience.map((exp, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <TextField
              label="Company"
              name="company"
              fullWidth
              value={exp.company || ''}
              onChange={(e) => handleExperienceChange(index, e)}
              sx={{ mb: 1 }}
            />
            <TextField
              label="Role"
              name="role"
              fullWidth
              value={exp.role || ''}
              onChange={(e) => handleExperienceChange(index, e)}
              sx={{ mb: 1 }}
            />
            <Button
              variant="text"
              color="secondary"
              onClick={() => removeExperience(index)}
            >
              Remove Experience
            </Button>
            <Divider sx={{ mt: 2 }} />
          </Box>
        ))}
        <Button variant="outlined" onClick={addExperience} sx={{ mb: 2 }}>
          Add Experience
        </Button>

        {/* Education Section */}
        <Typography variant="h6" gutterBottom>
          Education
        </Typography>
        {formData.education.map((edu, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <TextField
              label="Institution"
              name="institution"
              fullWidth
              value={edu.institution || ''}
              onChange={(e) => handleEducationChange(index, e)}
              sx={{ mb: 1 }}
            />
            <TextField
              label="Degree"
              name="degree"
              fullWidth
              value={edu.degree || ''}
              onChange={(e) => handleEducationChange(index, e)}
              sx={{ mb: 1 }}
            />
            <Button
              variant="text"
              color="secondary"
              onClick={() => removeEducation(index)}
            >
              Remove Education
            </Button>
            <Divider sx={{ mt: 2 }} />
          </Box>
        ))}
        <Button variant="outlined" onClick={addEducation} sx={{ mb: 2 }}>
          Add Education
        </Button>

        {/* Certifications Section */}
        <Typography variant="h6" gutterBottom>
          Certifications
        </Typography>
        {formData.certifications.map((cert, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <TextField
              label="Certification Name"
              name="certificationName"
              fullWidth
              value={cert.certificationName || ''}
              onChange={(e) => handleCertificationChange(index, e)}
              sx={{ mb: 1 }}
            />
            <TextField
              label="Institution"
              name="institution"
              fullWidth
              value={cert.institution || ''}
              onChange={(e) => handleCertificationChange(index, e)}
              sx={{ mb: 1 }}
            />
            <Button
              variant="text"
              color="secondary"
              onClick={() => removeCertification(index)}
            >
              Remove Certification
            </Button>
            <Divider sx={{ mt: 2 }} />
          </Box>
        ))}
        <Button variant="outlined" onClick={addCertification}>
          Add Certification
        </Button>
      </Grid>
    </Grid>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleClosePostDialog} color="secondary">
      Cancel
    </Button>
    <Button type="submit" onClick={handleUpdateProfile} color="primary">
      Save Changes
    </Button>
  </DialogActions>
</Dialog>

    </div>
  )
}

export default EditProfile
