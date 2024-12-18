// src/components/UsersList.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUsers } from '../api/axios'; // Import the Axios function
import { Box, Card, CardContent, Typography, Button } from '@mui/material';

const UsersList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch all users
    const fetchUsers = async () => {
      try {
        const usersData = await getUsers();
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      {users.length === 0 ? (
        <Typography variant="h6">No users found</Typography>
      ) : (
        users.map(user => (
          <Card key={user.id} sx={{ width: 300, marginBottom: 2 }}>
            <CardContent>
              <Typography variant="h6">{user.name}</Typography>
              <Typography variant="body2" color="textSecondary">
                {user.email}
              </Typography>
              <Link to={`/users/${user.id}`}>
                <Button variant="outlined" sx={{ marginTop: 1 }}>
                  View Profile
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
};

export default UsersList;
