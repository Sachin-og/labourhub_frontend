import React, { useState } from 'react';
import axios from '../api/axios'; // Import Axios instance
import { Box, TextField, Button, Typography, Container, Alert, Grid, Avatar, Paper } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [step, setStep] = useState(1); // Step 1: Registration, Step 2: OTP Verification
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [city, setCity] = useState('Jaipur'); // Default city
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // Send OTP to email
      const response = await axios.post('/api/auth/send-otp', { email });
      console.log('OTP sent:', response.data);
      setSuccess('OTP sent to your email. Please verify.');
      setError('');
      setStep(2); // Move to OTP verification step
    } catch (err) {
      console.error('Error sending OTP:', err.response || err.message);
      setError(err.response?.data?.error || 'Failed to send OTP');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      // Verify OTP
      const verifyResponse = await axios.post('/api/auth/verify-otp', { email, otp });
      console.log('OTP verified:', verifyResponse.data);

      // Complete registration after OTP verification
      await axios.post('/users/create', { name, email, password, city });
      setSuccess('Registration successful!');
      setError('');
      setTimeout(() => navigate('/home'), 2000); // Redirect to home page
    } catch (err) {
      console.error('Error verifying OTP:', err.response || err.message);
      setError(err.response?.data?.error || 'Failed to verify OTP');
    }
  };

  return (
    <Container component="main" maxWidth="xs"  sx={{ mt: 13 }}>
      <Paper
        elevation={3}
        sx={{
          mt: 8,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderRadius: 2,
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <PersonAddIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          {step === 1 ? 'Register' : 'Verify OTP'}
        </Typography>
        {step === 1 ? (
          <Box
            component="form"
            onSubmit={handleRegister}
            noValidate
            sx={{ mt: 3, width: '100%' }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Full Name"
              name="name"
              autoComplete="name"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <TextField
              margin="normal"
              fullWidth
              name="city"
              label="City"
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />

            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
            >
              Send OTP
            </Button>
          </Box>
        ) : (
          <Box
            component="form"
            onSubmit={handleVerifyOtp}
            noValidate
            sx={{ mt: 3, width: '100%' }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="otp"
              label="Enter OTP"
              name="otp"
              autoFocus
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
            >
              Verify OTP
            </Button>
          </Box>
        )}
        <Grid container justifyContent="flex-end">
          <Grid item>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ cursor: 'pointer' }}
            >
              <button onClick={() => navigate('/')}>Already have an account? Login</button>
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Register;
