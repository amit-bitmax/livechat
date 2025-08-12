// AgentAppbar.js
import React, { useState, useEffect, useMemo, useContext } from 'react';
import {
  AppBar as MuiAppBar, Box, Toolbar, CssBaseline, Typography, IconButton,
  Menu, Avatar, Stack, Tooltip, useMediaQuery,
  useTheme,
  Switch,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { styled } from '@mui/material/styles';
import Sidebar from '../../public/Sidebar';
import {QaData} from '../qa/QaData';

import Notifications from '../../public/Notifications';
import { ColorModeContext } from '../../../../App';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useGetProfileQuery } from '../../../../features/auth/authApi';
import { format } from 'date-fns-tz';
import StyledBadge from '../../../../stylejs/StyleBadge';
import ProfileCard from '../../UserProfileCard';
import { toast } from 'react-toastify';
const IMG_BASE_URL ='http://localhost:5003/uploads/profile';
const drawerWidth = 180;
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

const QaAppbar = ({ children }) => {
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

  const handleToggle = async () => {
      try {
        await toggleBreak().unwrap(); // ✅ Call API
        toast.success(`Status changed to ${agent?.data?.workStatus ? 'Break' : 'Active'}`);
        onToggle(agent._id); 
      } catch (error) {
        toast.error('Failed to update status');
      }
    };

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

  const renderProfileMenu = useMemo(() => (
    <Menu
      sx={{ mt: 1.5 }}
      elevation={0}
      anchorEl={profileAnchorEl}
      open={Boolean(profileAnchorEl)}
      onClose={handleProfileClose}
    >
      <ProfileCard
        agent={{ ...data, ...location, onBreak: data?.data?.breakLogs[0].end }}
        onToggle={handleToggleBreak}
      />

    </Menu>
  ), [profileAnchorEl]);

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
              <Stack spacing={1} alignItems={'center'} direction={'row'}>
                        <Typography variant='body2'>Status:</Typography>
                        <Typography
                          variant="caption"
                          color={data?.data?.workStatus ? "green": "red" }
                        >
                          {data?.data?.workStatus ?  "Active":"On Break"}
                        </Typography>
            
                        <Switch
                          size="small"
                          checked={!data?.data?.workStatus}
                          onChange={handleToggle} 
                          color="success"
                          inputProps={{ 'aria-label': 'status toggle' }}
                        />
                  </Stack>
            <IconButton onClick={colorMode.toggleColorMode} >
              {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
            <Tooltip title="Notifications">
              <IconButton size="small" onClick={handleNotifOpen}>
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
          </Stack>
        </Toolbar>
      </AppBar>
      <Sidebar open={open} handleDrawerClose={handleDrawerToggle} menuData={QaData} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 1,
          pt: 8,
          overflow:'hidden',
          // backgroundImage: `url(${IMG})`,
          // backgroundSize: 'cover',
          // backgroundPosition: 'center',
          // backgroundRepeat: 'no-repeat',
          backgroundImage: "linear-gradient(135deg, rgba(251, 247, 247, 0.7), rgba(222, 118, 49, 0.3), rgba(43, 57, 119, 0.3), rgba(121, 40, 119, 0.7))",
          backdropFilter: "blur(10px)",  
          WebkitBackdropFilter: "blur(10px)",
          width: open ? `calc(99.2vw - ${drawerWidth}px)` : "94vw",
          height:{ xs:'100%',lg:`calc(90vh + ${appHeight}px)`},
          // height:'100%'
        }}
      >
        {children}
      </Box>

      {renderProfileMenu}
      {renderNotificationMenu}
    </Box>
  );
};

export default QaAppbar;
