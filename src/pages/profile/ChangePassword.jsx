import React, { useState } from 'react';
import {
  Box, Button, Card, CardContent, TextField, Typography
} from '@mui/material';
import { useChangePasswordMutation } from './authApi';

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: '',
  });

  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.new_password !== formData.confirm_password) {
      return alert("New and Confirm Passwords do not match");
    }

    try {
      await changePassword({
        old_password: formData.old_password,
        new_password: formData.new_password,
      }).unwrap();
      alert("Password changed successfully!");
      setFormData({ old_password: '', new_password: '', confirm_password: '' });
    } catch (err) {
      console.error('Change password failed:', err);
      alert(err?.data?.message || 'Failed to change password');
    }
  };

  return (
    <Box display="flex" justifyContent="center" mt={5}>
      <Card sx={{ minWidth: 400, padding: 2 }}>
        <CardContent>
          <Typography variant="h5" mb={2}>Change Password</Typography>
          <form onSubmit={handleSubmit}>
            <Box display="flex" flexDirection="column" gap={2}>
              <TextField
                label="Old Password"
                name="old_password"
                type="password"
                value={formData.old_password}
                onChange={handleChange}
                required
              />
              <TextField
                label="New Password"
                name="new_password"
                type="password"
                value={formData.new_password}
                onChange={handleChange}
                required
              />
              <TextField
                label="Confirm New Password"
                name="confirm_password"
                type="password"
                value={formData.confirm_password}
                onChange={handleChange}
                required
              />
              <Button type="submit" variant="contained" color="primary" disabled={isLoading}>
                {isLoading ? 'Changing...' : 'Change Password'}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ChangePassword;
