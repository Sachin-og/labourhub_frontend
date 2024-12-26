import React, { useState, useEffect } from 'react';
import { getProfile, updateProfile } from '../api/axios';
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
  Link,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Checkbox
} from '@mui/material';

function EditProfile() {
  const [profile, setProfile] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    bio: '',
    skills: '',
    linkedin: '',
    github: '',
    website: '',
    experience: [],
    education: [],
    certifications: [],
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openPostDialog, setOpenPostDialog] = useState(false);

  const navigate = useNavigate();
  const userEmail = sessionStorage.getItem('userEmail');
  const userId = sessionStorage.getItem('userId');

  useEffect(() => {
    if (!userEmail) {
      navigate('/');
    }
  }, [navigate]);

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
          certifications: data.certifications || [],
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

  const addExperience = () => {
    setFormData({
      ...formData,
      experience: [
        ...formData.experience,
        { company: '', role: '', startDate: '', endDate: '' },
      ],
    });
  };

  const addEducation = () => {
    setFormData({
      ...formData,
      education: [
        ...formData.education,
        { institution: '', degree: '', startDate: '', endDate: '' },
      ],
    });
  };

  const addCertification = () => {
    setFormData({
      ...formData,
      certifications: [
        ...formData.certifications,
        { certificationName: '', institution: '', issueDate: '' },
      ],
    });
  };

  const removeExperience = (index) => {
    const updatedExperience = formData.experience.filter((_, i) => i !== index);
    setFormData({ ...formData, experience: updatedExperience });
  };

  const removeEducation = (index) => {
    const updatedEducation = formData.education.filter((_, i) => i !== index);
    setFormData({ ...formData, education: updatedEducation });
  };

  const removeCertification = (index) => {
    const updatedCertifications = formData.certifications.filter((_, i) => i !== index);
    setFormData({ ...formData, certifications: updatedCertifications });
  };

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

  const handleClosePostDialog = () => {
    setOpenPostDialog(false);
    window.location.reload();
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const cleanProfileData = (data) => {
      const cleanedData = {};
      Object.keys(data).forEach((key) => {
        if (data[key] !== null && data[key] !== '') {
          cleanedData[key] = data[key];
        }
      });
      return cleanedData;
    };

    const updatedData = cleanProfileData({
      ...formData,
      bio: formData.bio || '',
      skills: formData.skills || '',
      linkedin: formData.linkedin || '',
      github: formData.github || '',
      website: formData.website || '',
      experience: Array.isArray(formData.experience) ? formData.experience : [],
      education: Array.isArray(formData.education) ? formData.education : [],
      certifications: Array.isArray(formData.certifications) ? formData.certifications : [],
    });

    try {
      const updatedProfile = await updateProfile(updatedData);
      setProfile(updatedProfile);
      setSuccess('Profile updated successfully!');
      setEditMode(false);
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    }
  };

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpenPostDialog}
        sx={{
          marginRight: 2,
          borderRadius: '20px',
          backgroundColor: '#25D366',
          '&:hover': { backgroundColor: '#128C7E' }
        }}
      >
        Edit Profile
      </Button>
      <Dialog open={openPostDialog} onClose={handleClosePostDialog} maxWidth="md" fullWidth>
        <DialogTitle>Edit Your Profile</DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <form>
                <TextField
                  label="Name"
                  name="name"
                  fullWidth
                  value={formData.name || ''}
                  onChange={handleInputChange}
                  sx={{
                    mb: 2,
                    backgroundColor: '#f1f1f1',
                    borderRadius: '4px',
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#ccc',
                      },
                      '&:hover fieldset': {
                        borderColor: '#0084ff',
                      },
                    },
                  }}
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
                  sx={{
                    mb: 2,
                    backgroundColor: '#f1f1f1',
                    borderRadius: '4px',
                  }}
                  required
                />
                <TextField
                  label="Skills"
                  name="skills"
                  fullWidth
                  value={formData.skills || ''}
                  onChange={handleInputChange}
                  sx={{
                    mb: 2,
                    backgroundColor: '#f1f1f1',
                    borderRadius: '4px',
                  }}
                  required
                />
                <TextField
                  label="LinkedIn"
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
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 2 }}>Experience</Typography>
              {formData.experience.map((exp, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <TextField
                    label="Company"
                    name="company"
                    fullWidth
                    value={exp.company || ''}
                    onChange={(e) => handleExperienceChange(index, e)}
                    sx={{ mb: 1 }}
                    required
                  />
                  <TextField
                    label="Role"
                    name="role"
                    fullWidth
                    value={exp.role || ''}
                    onChange={(e) => handleExperienceChange(index, e)}
                    sx={{ mb: 1 }}
                    required
                  />
                  <TextField
                    label="Start Date"
                    name="startDate"
                    fullWidth
                    value={exp.startDate || ''}
                    onChange={(e) => handleExperienceChange(index, e)}
                    sx={{ mb: 1 }}
                    required
                  />
                  <TextField
                    label="End Date"
                    name="endDate"
                    fullWidth
                    value={exp.endDate || ''}
                    onChange={(e) => handleExperienceChange(index, e)}
                    sx={{ mb: 1 }}
                  />
                  <Button
                    color="error"
                    onClick={() => removeExperience(index)}
                    sx={{ mt: 1 }}
                  >
                    Remove
                  </Button>
                </Box>
              ))}
              <Button variant="outlined" onClick={addExperience}>Add Experience</Button>

              <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>Education</Typography>
              {formData.education.map((edu, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <TextField
                    label="Institution"
                    name="institution"
                    fullWidth
                    value={edu.institution || ''}
                    onChange={(e) => handleEducationChange(index, e)}
                    sx={{ mb: 1 }}
                    required
                  />
                  <TextField
                    label="Degree"
                    name="degree"
                    fullWidth
                    value={edu.degree || ''}
                    onChange={(e) => handleEducationChange(index, e)}
                    sx={{ mb: 1 }}
                    required
                  />
                  <TextField
                    label="Start Date"
                    name="startDate"
                    fullWidth
                    value={edu.startDate || ''}
                    onChange={(e) => handleEducationChange(index, e)}
                    sx={{ mb: 1 }}
                    required
                  />
                  <TextField
                    label="End Date"
                    name="endDate"
                    fullWidth
                    value={edu.endDate || ''}
                    onChange={(e) => handleEducationChange(index, e)}
                    sx={{ mb: 1 }}
                  />
                  <Button
                    color="error"
                    onClick={() => removeEducation(index)}
                    sx={{ mt: 1 }}
                  >
                    Remove
                  </Button>
                </Box>
              ))}
              <Button variant="outlined" onClick={addEducation}>Add Education</Button>

              <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>Certifications</Typography>
              {formData.certifications.map((cert, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <TextField
                    label="Certification"
                    name="certificationName"
                    fullWidth
                    value={cert.certificationName || ''}
                    onChange={(e) => handleCertificationChange(index, e)}
                    sx={{ mb: 1 }}
                    required
                  />
                  <TextField
                    label="Institution"
                    name="institution"
                    fullWidth
                    value={cert.institution || ''}
                    onChange={(e) => handleCertificationChange(index, e)}
                    sx={{ mb: 1 }}
                    required
                  />
                  <TextField
                    label="Issue Date"
                    name="issueDate"
                    fullWidth
                    value={cert.issueDate || ''}
                    onChange={(e) => handleCertificationChange(index, e)}
                    sx={{ mb: 1 }}
                    required
                  />
                  <Button
                    color="error"
                    onClick={() => removeCertification(index)}
                    sx={{ mt: 1 }}
                  >
                    Remove
                  </Button>
                </Box>
              ))}
              <Button variant="outlined" onClick={addCertification}>Add Certification</Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePostDialog} color="secondary">Cancel</Button>
          <Button onClick={handleUpdateProfile} color="primary">Update Profile</Button>
        </DialogActions>
      </Dialog>

      {error && (
        <Snackbar open={Boolean(error)} autoHideDuration={6000}>
          <Alert severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
      )}

      {success && (
        <Snackbar open={Boolean(success)} autoHideDuration={6000}>
          <Alert severity="success" sx={{ width: '100%' }}>
            {success}
          </Alert>
        </Snackbar>
      )}
    </div>
  );
}

export default EditProfile;
