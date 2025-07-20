// PrivateAppbar.js
import React, { useState, useEffect, useMemo, useContext } from 'react';
import {
  AppBar as MuiAppBar, Box, Toolbar, CssBaseline, Typography, IconButton,
  Menu, Avatar, Divider, Stack, Tooltip, useMediaQuery,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { styled } from '@mui/material/styles';
import Sidebar from './Sidebar';

import Notifications from './Notifications';
import { employee } from './menuData';
import { ColorModeContext } from '../../App';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useGetProfileQuery } from '../../features/auth/authApi';
import { format } from 'date-fns-tz';
import StyledBadge from '../../stylejs/StyleBadge';
import ProfileCard from './UserProfileCard';
const IMG_BASE_URL ='http://localhost:5003/uploads/profile';

const drawerWidth = 200;
const appHeight = 56;
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`
  })
}));

const PrivateAppbar = ({ children }) => {
  const [agent, setAgent] = useState(employee[0]);
  const isLaptop = useMediaQuery('(min-width:1024px)');
  const [open, setOpen] = useState(isLaptop);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [notifAnchorEl, setNotifAnchorEl] = useState(null);
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const { data,location, isLoading, isError } = useGetProfileQuery();

 
  useEffect(() => {
    setOpen(isLaptop);
  }, [isLaptop]);

  const handleDrawerToggle = () => setOpen((prev) => !prev);
  const handleProfileOpen = (event) => setProfileAnchorEl(event.currentTarget);
  const handleProfileClose = () => setProfileAnchorEl(null);

  const handleNotifOpen = (event) => setNotifAnchorEl(event.currentTarget);
  const handleNotifClose = () => setNotifAnchorEl(null);

  const handleToggleBreak = () => {
    setAgent(prev => {
      const onBreak = !prev.onBreak;
      const now = new Date().toISOString();

      let updatedLogs = [...(prev.data?.breakLogs || [])];

      if (onBreak) {
        // Start a new break
        updatedLogs.unshift({ start: now, end: null, duration: 0 });
      } else {
        // End the latest break
        if (updatedLogs.length > 0 && !updatedLogs[0].end) {
          const start = new Date(updatedLogs[0].start);
          const duration = Math.floor((new Date() - start) / 1000); // in seconds
          updatedLogs[0] = {
            ...updatedLogs[0],
            end: now,
            duration,
          };
        }
      }

      return {
        ...prev,
        onBreak,
        data: {
          ...prev.data,
          breakLogs: updatedLogs,
        },
      };
    });
  };

  const formatToIST = (date) => {
    return format(new Date(date), 'dd MMM yyyy, hh:mm:ss a', {
      timeZone: 'Asia/Kolkata',
    });
  };


  const renderProfileMenu = useMemo(() => (
    <Menu
      sx={{ mt: 1.5 }}
      elevation={0}
      anchorEl={profileAnchorEl}
      open={Boolean(profileAnchorEl)}
      onClose={handleProfileClose}
    >
      <ProfileCard
        agent={{ ...data, ...location, onBreak: agent?.data?.breakLogs[0].end }}
        onToggle={handleToggleBreak}
      />

    </Menu>
  ), [profileAnchorEl, agent]);

  const renderNotificationMenu = useMemo(() => (
    <Menu
      sx={{ mt: 2 }}
      elevation={0}
      anchorEl={notifAnchorEl}
      open={Boolean(notifAnchorEl)}
      onClose={handleNotifClose}
    >
      <Notifications onCloseNotification={handleNotifClose} />
    </Menu>
  ), [notifAnchorEl]);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        elevation={0}
        position="fixed"
        open={open}
        sx={{background:'#ebececf4'}}
      >
        <Toolbar>
          <IconButton size="small" onClick={handleDrawerToggle} edge="start" sx={{ mr: 2, ...(open && { display: 'none' }) }}>
            <MenuIcon sx={{ color: '#665b41ff' }} />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <Stack direction="row" alignItems="center" spacing={1}>
            <IconButton onClick={colorMode.toggleColorMode} color="primary">
              {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
            <Tooltip title="Notifications">
              <IconButton size="small" color='primary' onClick={handleNotifOpen}>
                <NotificationsNoneIcon />
              </IconButton>
            </Tooltip>

            <IconButton size="small" onClick={handleProfileOpen}>
              <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant={data?.data?.is_active === true ? "dot" : "none"}
              >
                <Avatar alt={data?.data?.first_name} src={`${IMG_BASE_URL}/${data?.data?.profileImage}`} sx={{ height: "30px", width: '30px' }} />
              </StyledBadge>
            </IconButton>

            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

            <Stack direction={'column'}>
              <Typography sx={{ fontSize: 12, color: '#827717', fontWeight: 'bold' }}>
                Hello, {data?.data?.user_name} {location?.city}
                </Typography>
                <Typography variant='body2'sx={{color: '#827717',}}>login Time : {data?.data?.login_time && formatToIST(data?.data?.login_time)}</Typography>
              
            </Stack>
          </Stack>
        </Toolbar>
      </AppBar>
      <Sidebar open={open} handleDrawerClose={handleDrawerToggle} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 1,
          pt: 8,
          overflow: 'hidden',
          // backgroundImage: "linear-gradient(to right,#F7F9FB)",
          width: open ? `calc(98.8vw - ${drawerWidth}px)` : "93vw",
          height: `calc(100vw - ${appHeight}px)`
        }}
      >
        {children}
      </Box>

      {renderProfileMenu}
      {renderNotificationMenu}
    </Box>
  );
};

export default PrivateAppbar;
