import React, { useState } from 'react';
import axios from '../api/axios'; // Import Axios instance
import { Box, TextField, Button, Typography, Container, Alert, Grid, Avatar, Paper } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirect



const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/users/login', { email, password });
      const token = response.data.token;

      // Save token to localStorage or HttpOnly cookies
      localStorage.setItem('token', token);

      setSuccess('Login successful!');
      setError('');

      // Redirect to the home page after successful login
      navigate('/home'); // Replace '/home' with your actual home route
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
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
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <Box
          component="form"
          onSubmit={handleLogin}
          noValidate
          sx={{ mt: 3, width: '100%' }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
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
          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
          >
            Login
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ cursor: 'pointer' }}
              >
                <button onClick={() => navigate('/register')}>Don't have an account? Sign Up</button>
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
