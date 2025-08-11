import React, { useState } from 'react';
import {
  Box, Button, Card, CardContent, TextField, Typography, Avatar, CircularProgress
} from '@mui/material';
import { useGetProfileQuery, useUpdateProfileMutation } from './authApi';

const EditProfile = () => {
  const { data, isLoading, isError, refetch } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const user = data?.data;

  const [formData, setFormData] = useState({
    user_name: user?.user_name || '',
    mobile: user?.mobile || '',
    first_name: user?.name?.first_name || '',
    last_name: user?.name?.last_name || '',
  });

  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('user_name', formData.user_name);
    form.append('mobile', formData.mobile);
    form.append('name.first_name', formData.first_name);
    form.append('name.last_name', formData.last_name);
    if (image) form.append('profileImage', image);

    try {
      await updateProfile(form).unwrap();
      alert('Profile updated!');
      refetch(); // Refresh data
    } catch (err) {
      console.error('Update failed:', err);
      alert(err?.data?.message || 'Update failed');
    }
  };

  if (isLoading) return <CircularProgress />;
  if (isError) return <Typography color="error">Failed to load profile</Typography>;

  return (
    <Box display="flex" justifyContent="center" mt={5}>
      <Card sx={{ minWidth: 400, padding: 2 }}>
        <CardContent>
          <Typography variant="h5" mb={2}>Edit Profile</Typography>
          <form onSubmit={handleSubmit}>
            <Box display="flex" flexDirection="column" gap={2}>
              <TextField
                label="Username"
                name="user_name"
                value={formData.user_name}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Mobile"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="First Name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Last Name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                fullWidth
              />
              <Button variant="outlined" component="label">
                Upload Profile Image
                <input type="file" hidden onChange={handleImageChange} />
              </Button>
              {user?.profileImage && (
                <Avatar
                  src={`http://localhost:5000/uploads/${user.profileImage}`}
                  sx={{ width: 60, height: 60, mx: 'auto' }}
                />
              )}
              <Button type="submit" variant="contained" color="primary" disabled={isUpdating}>
                {isUpdating ? 'Updating...' : 'Update Profile'}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default EditProfile;
