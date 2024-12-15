import React from "react";
import { Box, Typography, Card, CardContent, Button } from "@mui/material";

const Feed = () => {
  return (
    <Box sx={{ maxWidth: 600, margin: "auto", mt: 4 }}>
      <Card variant="outlined" sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6">User Name</Typography>
          <Typography variant="body2" color="text.secondary">
            Posted 5 mins ago
          </Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            Looking for job opportunities in Jaipur!
          </Typography>
          <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
            <Button variant="outlined">Like</Button>
            <Button variant="outlined">Comment</Button>
            <Button variant="outlined">Share</Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Feed;
