import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardMedia, Avatar, Typography, Button,Link ,Box, CircularProgress } from '@mui/material';
import { getPostById, getUserById } from '../../api/axios'; // API functions to fetch post and user data
import { styled } from '@mui/system';
// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 600,
  margin: '20px auto',
  borderRadius: 16,
  boxShadow: theme.shadows[5],
  overflow: 'hidden',
}));

const UserSection = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  padding: '16px',
  backgroundColor: '#f5f5f5',
});

const UserAvatar = styled(Avatar)({
  width: 56,
  height: 56,
  marginRight: 16,
});

const JobImage = styled(CardMedia)({
  height: 250,
  objectFit: 'cover',
});

const RequestButton = styled(Button)({
  marginTop: 16,
  fontWeight: 'bold',
});
const postId = "00e354b4-166d-4abc-b8cc-b1cc3b6ea84b";
const FeedPost = ({ postId }) => {
  const [post, setPost] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        // Fetch post details
        const postData = await getPostById(postId);
        setPost(postData);

        // Fetch user details based on the post's userId
        const userData = await getUserById(postData.userid);
        setUser(userData);
      } catch (error) {
        console.error('Error fetching post or user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPostDetails();
  }, [postId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="300px">
        <CircularProgress />
      </Box>
    );
  }

  if (!post || !user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="300px">
        <Typography variant="h6" color="error">
          Unable to load post data.
        </Typography>
      </Box>
    );
  }

  return (
    <StyledCard>
      {/* User Section */}
      <UserSection>
        <UserAvatar src={user.profilePicture || '/default-profile.jpg'} alt={user.name} />
        <Box>
          <Typography variant="h6">{user.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {user.email}
          </Typography>
        </Box>
      </UserSection>

      {/* Post Content */}
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {post.title || 'Job Opportunity'}
        </Typography>
        <Typography variant="body1" paragraph>
          {post.content || 'No description available for this job.'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
            {post.location ? (
              <Link
                href={post.location}
                target="_blank"
                rel="noopener noreferrer"
                color="primary"
              >
                Location
              </Link>
            ) : (
              'Location Not Provided'
            )}
          </Typography>
        {/* Job Image */}
        {post.jobimage && (
          <JobImage
            component="img"
            src={post.jobimage}
            alt="Job Image"
          />
        )}

        {/* Request Hiring Button */}
        <RequestButton variant="contained" color="primary" fullWidth>
          Request for Hiring
        </RequestButton>
      </CardContent>
    </StyledCard>
  );
};

export default FeedPost;
