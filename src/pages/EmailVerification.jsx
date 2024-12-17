import React, { useState } from 'react';
import axios from '../api/axios';
import { Box, TextField, Button, Typography, Alert, Container, Paper } from '@mui/material';

const EmailVerification = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // Step 1: Enter email, Step 2: Enter OTP
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const sendOtp = async () => {
    try {
      const response = await axios.post('/users/send-otp', { email });
      setMessage(response.data.message);
      setStep(2); // Move to Step 2: Enter OTP
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send OTP');
    }
  };

  const verifyOtp = async () => {
    try {
      const response = await axios.post('/users/verify-otp', { email, otp });
      setMessage(response.data.message);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to verify OTP');
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
        <Typography component="h1" variant="h5">
          Email Verification
        </Typography>
        <Box component="form" sx={{ mt: 3, width: '100%' }}>
          {step === 1 && (
            <>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 3, mb: 2 }}
                onClick={sendOtp}
              >
                Send OTP
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <Button
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 3, mb: 2 }}
                onClick={verifyOtp}
              >
                Verify OTP
              </Button>
            </>
          )}

          {error && <Alert severity="error">{error}</Alert>}
          {message && <Alert severity="success">{message}</Alert>}
        </Box>
      </Paper>
    </Container>
  );
};

export default EmailVerification;
