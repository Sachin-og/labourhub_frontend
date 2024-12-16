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
} from '@mui/material';

const Profile = () => {
  const [profile, setProfile] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  // Fetch email from localStorage
  const userEmail = localStorage.getItem('userEmail');
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
  
  // Handle form input changes
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


  // Submit updated profile
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
  
    const updatedData = {
      ...formData,
      experience: formData.experience.map(exp => ({
        company: exp.company,
        role: exp.role,
        startDate: exp.startDate,
        endDate: exp.endDate,
      })),
      education: formData.education.map(edu => ({
        institution: edu.institution,
        degree: edu.degree,
        startDate: edu.startDate,
        endDate: edu.endDate,
      })),
      certifications: formData.certifications.map(cert => ({
        certificationName: cert.certificationName,
        institution: cert.institution,
        issueDate: cert.issueDate,
      })),
    };
  
    try {
      await updateProfile(updatedData);
      const updatedProfile = await getProfile(userEmail);
      setProfile(updatedProfile);
      setSuccess('Profile updated successfully!');
      setEditMode(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile');
    }
  };
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
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
            {!editMode && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => setEditMode(true)}
              >
                Edit Profile
              </Button>
            )}
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Main Sections */}
        {!editMode ? (
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
        ) : (
          <form onSubmit={handleUpdateProfile}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleInputChange}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="City"
                  name="city"
                  value={formData.city || ''}
                  onChange={handleInputChange}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Skills"
                  name="skills"
                  value={formData.skills || ''}
                  onChange={handleInputChange}
                  sx={{ mb: 2 }}
                />
                
                {/* Experience Form */}
                <Typography variant="h6" fontWeight="bold">
                  Experience
                </Typography>
                {formData.experience &&
                  formData.experience.map((exp, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <TextField
                        fullWidth
                        label="Company"
                        name="company"
                        value={exp.company || ''}
                        onChange={(e) => handleExperienceChange(index, e)}
                        sx={{ mb: 1 }}
                      />
                      <TextField
                        fullWidth
                        label="Role"
                        name="role"
                        value={exp.role || ''}
                        onChange={(e) => handleExperienceChange(index, e)}
                        sx={{ mb: 1 }}
                      />
                      <TextField
                        fullWidth
                        label="Start Date"
                        name="startDate"
                        value={exp.startDate || ''}
                        onChange={(e) => handleExperienceChange(index, e)}
                        sx={{ mb: 1 }}
                      />
                      <TextField
                        fullWidth
                        label="End Date"
                        name="endDate"
                        value={exp.endDate || ''}
                        onChange={(e) => handleExperienceChange(index, e)}
                        sx={{ mb: 1 }}
                      />
                       <Button
                        variant="outlined"
                        color="error"
                        onClick={() => removeExperience(index)}
                        sx={{ mt: 1 }}
                      >
                        Remove Experience
                      </Button>
                    </Box>
                  ))}
                <Button variant="outlined" onClick={addExperience} sx={{ mb: 2 }}>
                  Add Experience
                </Button>

                {/* Education Form */}
                <Typography variant="h6" fontWeight="bold">
                  Education
                </Typography>
                {formData.education &&
                  formData.education.map((edu, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <TextField
                        fullWidth
                        label="Institution"
                        name="institution"
                        value={edu.institution || ''}
                        onChange={(e) => handleEducationChange(index, e)}
                        sx={{ mb: 1 }}
                      />
                      <TextField
                        fullWidth
                        label="Degree"
                        name="degree"
                        value={edu.degree || ''}
                        onChange={(e) => handleEducationChange(index, e)}
                        sx={{ mb: 1 }}
                      />
                      <TextField
                        fullWidth
                        label="Start Date"
                        name="startDate"
                        value={edu.startDate || ''}
                        onChange={(e) => handleEducationChange(index, e)}
                        sx={{ mb: 1 }}
                      />
                      <TextField
                        fullWidth
                        label="End Date"
                        name="endDate"
                        value={edu.endDate || ''}
                        onChange={(e) => handleEducationChange(index, e)}
                        sx={{ mb: 1 }}
                      />
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => removeEducation(index)}
                        sx={{ mt: 1 }}
                      >
                        Remove Education
                      </Button>
                    </Box>
                  ))}
                <Button variant="outlined" onClick={addEducation} sx={{ mb: 2 }}>
                  Add Education
                </Button>
                {/* Certifications Form */}
                  <Typography variant="h6" fontWeight="bold">
                    Certifications
                  </Typography>
                  {formData.certifications &&
                    formData.certifications.map((cert, index) => (
                      <Box key={index} sx={{ mb: 2 }}>
                        <TextField
                          fullWidth
                          label="Certification Name"
                          name="certificationName"
                          value={cert.certificationName || ''}
                          onChange={(e) => handleCertificationChange(index, e)}
                          sx={{ mb: 1 }}
                        />
                        <TextField
                          fullWidth
                          label="Institution"
                          name="institution"
                          value={cert.institution || ''}
                          onChange={(e) => handleCertificationChange(index, e)}
                          sx={{ mb: 1 }}
                        />
                        <TextField
                          fullWidth
                          label="Issue Date"
                          name="issueDate"
                          value={cert.issueDate || ''}
                          onChange={(e) => handleCertificationChange(index, e)}
                          sx={{ mb: 1 }}
                        />
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => removeCertification(index)}
                          sx={{ mt: 1 }}
                        >
                          Remove Certification
                        </Button>
                      </Box>
                    ))}
                  <Button variant="outlined" onClick={addCertification} sx={{ mb: 2 }}>
                    Add Certification
                  </Button>

              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Bio"
                  name="bio"
                  multiline
                  rows={4}
                  value={formData.bio || ''}
                  onChange={handleInputChange}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="LinkedIn"
                  name="linkedin"
                  value={formData.linkedin || ''}
                  onChange={handleInputChange}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="GitHub"
                  name="github"
                  value={formData.github || ''}
                  onChange={handleInputChange}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Website"
                  name="website"
                  value={formData.website || ''}
                  onChange={handleInputChange}
                  sx={{ mb: 2 }}
                />
              </Grid>
            </Grid>
            <Box mt={3} display="flex" justifyContent="space-between">
              <Button type="submit" variant="contained" color="primary">
                Save Changes
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => setEditMode(false)}
              >
                Cancel
              </Button>
            </Box>
          </form>
        )}
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
