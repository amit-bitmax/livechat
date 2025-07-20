import React, { useState } from 'react';
import {
  Box, Button, Card, CardContent, InputAdornment, IconButton,
  Grid, TextField, Typography, useTheme, Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  EmailOutlined, LockOutlined, Visibility, VisibilityOff
} from '@mui/icons-material';
import { useLoginUserMutation } from '../features/auth/authApi';
import { connectSocket } from '../socket/socket';

const Login = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [loginUser, { isLoading }] = useLoginUserMutation();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      employee_id: '',
      email: '',
      password: ''
    },
    validationSchema: Yup.object({
      employee_id: Yup.string().required('Employee ID is required'),
      email: Yup.string().email('Invalid email').required('Email is required'),
      password: Yup.string().required('Password is required'),
    }),
    onSubmit: async (values) => {
      try {
        const res = await loginUser(values).unwrap();
        const userId = res.data?._id || res.data?.id;
        const token = res.token;

        localStorage.setItem('token', token);
        connectSocket({ token, id: userId });

        if (res.data?.role === 'Agent') {
          toast.success('Login successful!');
          navigate('/');
        } else {
          toast.error('Access denied: Not an agent.');
        }
      } catch (error) {
        console.error('Login error:', error);
        toast.error(error?.data?.message || 'Login failed');
      }
    }
  });

  const renderTextField = (label, name, icon, type = 'text', showToggle = false) => (
    <>
      <Typography variant="body2" sx={{ my: 1 }}>{label}:</Typography>
      <TextField
        fullWidth
        placeholder={label}
        type={showToggle ? (showPassword ? 'text' : 'password') : type}
        {...formik.getFieldProps(name)}
        error={formik.touched[name] && Boolean(formik.errors[name])}
        helperText={formik.touched[name] && formik.errors[name]}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              {icon}
            </InputAdornment>
          ),
          ...(showToggle && {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
                  {showPassword
                    ? <Visibility sx={{ color: theme.palette.primary.main }} />
                    : <VisibilityOff sx={{ color: theme.palette.primary.main }} />}
                </IconButton>
              </InputAdornment>
            ),
          }),
          sx: {
            borderRadius: '5px',
            border: '1px solid #eee',
            fontWeight: 100,
          }
        }}
      />
    </>
  );

  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} pauseOnFocusLoss draggable />
      <Box
        sx={{
          height: '100vh',
          width: '100vw',
          backgroundImage: "linear-gradient(to left, #87dbaa, #18842A, #87dbaa)",
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Grid container justifyContent="center">
          <Grid size={{xs:12,lg:12}}>
            <Card elevation={2} sx={{
              borderRadius: 2,
              backdropFilter: 'blur(10px)',
              background: 'rgba(252,252,255,0.1)'
            }}>
              <CardContent>
                <Typography variant="h4" textAlign="center">Login</Typography>
                <Divider sx={{ my: 1 }} />
                <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 2 }}>
                  {renderTextField('Employee ID', 'employee_id', <EmailOutlined sx={{ color: theme.palette.primary.main }} />)}
                  {renderTextField('Email', 'email', <EmailOutlined sx={{ color: theme.palette.primary.main }} />)}
                  {renderTextField('Password', 'password', <LockOutlined sx={{ color: theme.palette.primary.main }} />, 'password', true)}

                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={isLoading}
                    sx={{ mt: 2 }}
                  >
                    {isLoading ? 'Logging in...' : 'Login'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Login;
