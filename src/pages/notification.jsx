import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // For accessing URL parameters
import { fetchNotifications } from '../api/axios'; // Adjust the path as needed
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Grid,
  Stack,
} from '@mui/material';

const Notification = () => {
  const { userId } = useParams(); // Extract userId from the URL
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getNotifications = async () => {
      try {
        const response = await fetchNotifications(userId);
        setNotifications(response.data); // Assuming API returns { success: true, data: [...] }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      getNotifications();
    }
  }, [userId]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Notifications
      </Typography>
      {notifications.length > 0 ? (
        <Grid container spacing={3}>
          {notifications.map((notification) => (
            <Grid item xs={12} sm={6} md={4} key={notification.id}>
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="body1" gutterBottom>
                    {notification.message}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Posted on: {new Date(notification.created_at).toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <Typography variant="body1" color="textSecondary">
            No notifications available.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Notification;
