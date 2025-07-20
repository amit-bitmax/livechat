import { useState } from 'react';
import {
  Box, Tabs, Tab, List, ListItem, ListItemText, Card, Divider,
  Grid,
  Avatar,
  OutlinedInput,
  InputAdornment,
  Typography,
  styled,
  Badge,
  Stack,
  IconButton
} from '@mui/material';
import { chatData } from './chatData';
import { MoreVert, Search, VideocamOutlined } from '@mui/icons-material';
import { format, formatDistanceToNow, differenceInSeconds } from 'date-fns';

const Chat = () => {
  const [tab, setTab] = useState(0);
  const allUsers = chatData;
  const activeUsers = chatData.filter((agent) => agent.status === "Active");
  const [selectedUser, setSelectedUser] = useState(1);
  const usersToShow = tab === 0 ? allUsers : activeUsers;
  const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
      backgroundColor: '#44b700',
      color: '#44b700',
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      '&::after': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        animation: 'ripple 1.2s infinite ease-in-out',
        border: '1px solid currentColor',
        content: '""',
      },
    },
    '@keyframes ripple': {
      '0%': {
        transform: 'scale(.8)',
        opacity: 1,
      },
      '100%': {
        transform: 'scale(2.4)',
        opacity: 0,
      },
    },
  }));

  const renderTime = (activeSince) => {
    const date = new Date(activeSince);
    const secondsAgo = differenceInSeconds(new Date(), date);
    const daysAgo = Math.floor(secondsAgo / (3600 * 24));

    if (daysAgo >= 1) return `${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`;
    if (secondsAgo >= 59) return format(date, 'dd MMM');
    return 'just now';
  };

  return (
    <>
      <Grid container spacing={10} >
        <Grid size={{ xs: 12, lg: 3 }}>
          <Card elevation={0} sx={{ p: 2, width: 300,height:'88vh' }}>
           
             <Tabs
              value={tab}
              onChange={(e, newValue) => setTab(newValue)}
              variant="fullWidth"
              sx={{ mb: 1 }}
            >
              <Tab size="small" label="Messages" sx={{ minHeight: 32, height: 32, fontSize: 12 }} />
              <Tab size="small" label="Active" sx={{ minHeight: 32, height: 32, fontSize: 12 }} />
            </Tabs>
            <Box>
              <OutlinedInput
                startAdornment={
                  <InputAdornment position="start">
                    <Search sx={{ color: '#999' }} />
                  </InputAdornment>
                }
                sx={{ color: '#000' }}
                size="small"
                fullWidth
                type="search"
                placeholder="Search by name or email..."
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Box>
            <Divider sx={{ mb: 1 }} />
            <List dense>
              {usersToShow.map((user) => (
                <ListItem spacing={3} key={user.id} button onClick={() => setSelectedUser(user)} >
                  <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                    <Stack direction={'row'} spacing={1} alignItems={'center'}>
                      <StyledBadge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        variant={user?.status === "Active" ? "dot" : "none"}
                      >
                        <Avatar alt="Remy Sharp" src="" sx={{ height: "30px", width: '30px' }} />
                      </StyledBadge>
                      <ListItemText
                        primary={user.username}
                        secondary={user.message}
                      />
                    </Stack>
                    <Box>
                      {user.activeSince && (
                        <Typography
                          sx={{ textAlign: 'left' }}
                          fontSize={11}
                          color="text.secondary"
                          title={format(new Date(user.activeSince), 'PPPpp')}
                        >
                          {renderTime(user.activeSince)}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </ListItem>
              ))}
            </List>

          </Card>
        </Grid>
        <Grid size={{ xs: 12, lg: 9 }} sx={{pl:5}}  >
          <Card elevation={0} sx={{ border: 'none' ,p:2}}>
            {selectedUser ? (
              <Box>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Avatar sx={{ width: 40, height: 40 }} />
                    <Typography variant="subtitle1" fontWeight="bold">
                      {selectedUser.username}
                      <Stack direction={'row'} spacing={1}>
                        <Typography>Last seen : </Typography>
                        {selectedUser.activeSince && (
                        <Typography
                          sx={{ textAlign: 'left' }}
                          fontSize={11}
                          color="text.secondary"
                          title={format(new Date(selectedUser.activeSince), 'PPPpp')}
                        >
                          {renderTime(selectedUser.activeSince)}
                        </Typography>
                      )}
                      </Stack>
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1}>
                    <IconButton size="small">
                      <VideocamOutlined />
                    </IconButton>
                    <IconButton size="small">
                      <MoreVert />
                    </IconButton>
                  </Stack>
                </Stack>
                <Divider />
                <Typography mt={2}>Start chatting with {selectedUser.username}...</Typography>
              </Box>
            ) : (
              <Typography>Select a user to start chat</Typography>
            )}
          </Card>
        </Grid>
      </Grid>
    </>

  );
};

export default Chat;
