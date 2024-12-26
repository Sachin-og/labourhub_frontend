import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // For accessing URL parameters
import { fetchNotifications, getUserById } from '../api/axios'; // Adjust the path as needed
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Grid,
  Stack,
  Avatar
} from '@mui/material';

const Notification = () => {
  const { userId } = useParams(); // Extract userId from the URL
  const [notifications, setNotifications] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user details by userId
  const fetchUserDetails = async (userId) => {
    try {
      const userData = await getUserById(userId);
      console.log(userData);
      setUserDetails(prevState => ({
        ...prevState,
        [userId]: userData
      }));
    } catch (err) {
      console.error('Error fetching user details:', err);
    }
  };

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

  useEffect(() => {
    // Fetch user details for each notification when they are fetched
    notifications.forEach(notification => {
      if (notification.userId && !userDetails[notification.userId]) {
        fetchUserDetails(notification.userId);
      }
    });
  }, [notifications, userDetails]);

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
    <Box sx={{ p: 3, backgroundColor: '#f1f1f1' }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#128C7E' }}>
        Notifications
      </Typography>
      {notifications.length > 0 ? (
        <Grid container spacing={3}>
          {notifications.map((notification) => {
            const user = userDetails[notification.userId]; // Get the user details for the notification's userId
            return (
              <Grid item xs={12} sm={6} md={4} key={notification.id}>
                <Card elevation={3} sx={{ borderRadius: '10px', backgroundColor: '#ffffff' }}>
                  <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                      alt={user?.name || 'User'}
                      src={user?.profilePicture || '/default-avatar.png'} // Use default image if no profilePicture
                      sx={{ width: 40, height: 40 }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body1" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
                        {user?.name || 'Unknown User'}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {notification.message}
                      </Typography>
                      <Typography variant="caption" color="textSecondary" sx={{ mt: 1 }}>
                        Posted on: {new Date(notification.created_at).toLocaleString()}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
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
