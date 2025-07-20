import React from 'react';
import {
  Box, Card, CardContent, Typography, Avatar, CircularProgress
} from '@mui/material';
import { useGetProfileQuery } from '../../features/auth/authApi';
import StyledBadge from '../../stylejs/StyleBadge';
const IMG_BASE_URL = 'http://localhost:5003/uploads/profile';

const Profile = () => {
  const { data, isLoading, isError } = useGetProfileQuery();

  if (isLoading) return <Box textAlign="center" mt={5}><CircularProgress /></Box>;
  if (isError) return <Typography color="error" textAlign="center" mt={5}>Failed to fetch profile</Typography>;
  const user = data?.data;
  const location = user?.location;
  return (
    <Box display="flex" justifyContent="center" mt={5}>
      <Card sx={{ minWidth: 400, padding: 2 }}>
        <CardContent>
          <Box display="flex" flexDirection="column" alignItems="center">
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              variant={user?.is_active === true ? "dot" : "none"}
            >
              <Avatar alt={user?.first_name} src={`${IMG_BASE_URL}/${user?.profileImage}`} sx={{ height: "80px", width: '80px' }} />
            </StyledBadge>
            <Typography variant="h6">UserName: {user?.name?.first_name} {user?.name?.last_name}</Typography>
            <Typography variant="body2">Email: {user.email}</Typography>
            <Typography variant="body2">Contact: {user.contact}</Typography>
            <Typography variant="body2">Role: {user.role}</Typography>
            <Typography variant="body2">
              Name: {user.name?.first_name} {user.name?.last_name}
            </Typography>
          </Box>
          <Box>
            <Typography>IP Address: {location?.ip}</Typography>
            <Typography>City: {location?.city}</Typography>
            <Typography>Region: {location?.region}</Typography>
            <Typography>Country: {location?.country}</Typography>
            <Typography>ISP: {location?.isp}</Typography>
            <Typography>Timezone: {location?.timezone}</Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Profile;
