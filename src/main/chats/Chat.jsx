import { useRef, useState, useMemo, useEffect } from "react";
import {
  Box, Tabs, Tab, List, ListItem, ListItemText, Card,
  Grid, Avatar, OutlinedInput, InputAdornment, Typography,
  styled, Badge, Stack, IconButton, TextField, CircularProgress
} from "@mui/material";
import { Search, Send, Videocam, CallEnd, HorizontalRule, Call } from "@mui/icons-material";
import { useGetAllCustomerQuery } from "../../features/customer/customerApi";
import { useGetConversationQuery, useSendMessageMutation } from "../../features/chat/chatApi";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import {
  useCreateCallMutation,
  useUpdateCallStatusMutation,
  useGetCallHistoryQuery
} from "../../features/room/roomApi";
import Profile from "../../pages/profile/Profile";
import ChatSkeleton from "../../components/reusable/SkeltonCard";
import VideoCallModal from "../../calls/VideoCallModal";
import renderTime from "../../utils/renderTime";
import ChatReply from "../../components/common/public/ChatReply";
import chatSocket from "../../socket/chatSocket";

const IMG_BASE_URL = "http://localhost:5003/uploads/profile";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 1px ${theme.palette.primary.light}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""'
    }
  },
  "@keyframes ripple": {
    "0%": { transform: "scale(.8)", opacity: 1 },
    "100%": { transform: "scale(2.4)", opacity: 0 }
  }
}));


const Chat = ({ currentUserId }) => {
  const [tab, setTab] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [text, setText] = useState("");
  const [isCallOpen, setIsCallOpen] = useState(false);
  const token = localStorage.getItem("token");
  const decoded = token ? jwtDecode(token) : null;
  const agentId = decoded?.id;

  const { data: callsData, isLoading: loadingCalls } = useGetCallHistoryQuery();
  const calls = callsData?.data || [];

  const { data: customerData } = useGetAllCustomerQuery();
  const customers = customerData?.data || [];

  const [sendMessage] = useSendMessageMutation();
  const [createCall] = useCreateCallMutation();
  const [updateCallStatus] = useUpdateCallStatusMutation();

  const filteredCustomers = useMemo(() => {
    return customers.filter(
      (user) =>
        (tab === 0 || user?.is_active) &&
        (user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user?.email?.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [customers, tab, searchQuery]);

  const otherUserId = selectedUser?._id;
const [liveMessages, setLiveMessages] = useState([]); // only live updates
  const { data:messagesData, isLoading: loadingMessages } = useGetConversationQuery(
    selectedUser?._id,
    { skip: !selectedUser }
  );
   const roomId = [currentUserId, otherUserId].sort().join("_");
const handleSend = async () => {
  if (!text.trim() || !otherUserId) return;

  const roomId = [currentUserId, otherUserId].sort().join("_");
  const newMessage = {
    from: currentUserId,
    to: otherUserId,
    message: text.trim(),
    createdAt: new Date().toISOString(),
  };

  // Emit to room
  chatSocket.emit("sendMessage", { roomId, message: newMessage });

  // Optimistic UI update
  setLiveMessages((prev) => [...prev, newMessage]);
  setText("");

  try {
    await sendMessage({ to: otherUserId, message: newMessage.message }).unwrap();
  } catch (err) {
    toast.error(err?.data?.message || "Send failed");
  }
};

  

// join room + listen for new messages
useEffect(() => {
  if (!otherUserId || !currentUserId) return;

  chatSocket.emit("joinRoom", roomId);

  // chatSocket.on("receiveMessage", (msg) => {
  //   setLiveMessages((prev) => [...prev, msg]);
  // });

  // return () => {
  //   chatSocket.off("receiveMessage");
  // };
}, [roomId, otherUserId, currentUserId]);

// combine API history + live messages
const combinedMessages = useMemo(() => {
  const history = messagesData?.data?.flatMap(item => item.messages || []) || [];
  return [...history, ...liveMessages].sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  );
}, [messagesData, liveMessages]);

  const startVideoCall = async () => {
    if (!selectedUser) return toast.error("Select a user first");
    try {
      const newRoomId = `room-${agentId}-${selectedUser._id}`;
      await createCall({
        roomId: newRoomId,
        callerId: agentId,
        receiverId: selectedUser._id
      }).unwrap();
      setIsCallOpen(true);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to start call");
    }
  };
  const endCall = async (id) => {
    try {
      await updateCallStatus({ roomId: id, status: "ended" }).unwrap();
      toast.info("Call ended");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to end call");
    }
  };


  const ChatMessage = ({ msg, selectedUser }) => {
    console.log("msg", msg?.from);
    const isFrom = msg?.from === selectedUser?._id;
    const isTo = msg?.to === selectedUser?._id;
    console.log("isFrom", selectedUser?._id, isFrom);
    return (
      <Box mb={1} display="flex" justifyContent={isFrom ? "flex-start" : "flex-end"}>
        <Stack direction="row" sx={{ flexDirection: isFrom ? "row" : "row-reverse" }}>
          {/* <Avatar
            alt={isFrom ? msg?.from?.name : msg?.to?.name}
            src={
              isFrom && msg?.from?.profileImage
                ? `${IMG_BASE_URL}/${selectedUser.profileImage}`
                : msg?.to?.profileImage
                  ? `${IMG_BASE_URL}/${selectedUser.profileImage}`
                  : ''
            }
          /> */}
          <Box>
            <Box
              sx={{
                mt: 0.2,
                backgroundColor: isFrom ? "#d9efc1ff" : "#cbe2ddff",
                p: 1,
                px: 2,
                borderRadius: 2,
                maxWidth: 300
              }}
            >
            <Stack direction={'row'} spacing={2} alignItems={'center'}>
              <Typography variant="body1">{msg?.message}</Typography>
                <IconButton sx={{height:'20px',width:'20px'}} size="small"><ChatReply/></IconButton>
            </Stack>
            </Box>
            <Typography variant="body2" sx={{ fontSize: "10px", mt: 1, ml: 1 }}>
              {renderTime(msg?.createdAt)}
            </Typography>
          </Box>
        </Stack>
      </Box>
    );
  };

  return (
    <>
      <Grid container spacing={1}>
        {/* Left Panel */}
        <Grid size={{ xs: 12, lg: 3 }}>
          <Card sx={{ p: 2 }}>
            <OutlinedInput
              startAdornment={
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              }
              fullWidth
              size="small"
              placeholder="Search..."
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Tabs
              value={tab}
              onChange={(e, val) => setTab(val)}
              sx={{ mb: 1, display: "flex", justifyContent: "space-between" }}
            >
              <Tab sx={{ mt: 1, minWidth: 75 }} label="Messages" />
              <Tab sx={{ mt: 1, minWidth: 75 }} label="Active" />
              <Tab sx={{ mt: 1, minWidth: 75 }} label="Calls" />
            </Tabs>
            <Box sx={{ height: { xs: '100vh', lg: "70vh" },scrollbarWidth:'none', "&::-webkit-scrollbar":{display:'none'}, overflowY: "auto",}}>
              {tab === 2 ? (
                loadingCalls ? (
                  <CircularProgress />
                ) : calls.length > 0 ? (
                  <List>
                    {calls?.map((call) => (
                      <ListItem key={call._id} divider>
                        <Avatar>
                          {call.participants[0]?.userId?.name?.charAt(0)}
                        </Avatar>
                        <ListItemText
                          primary={`${call.roomId}`}
                          secondary={`Status: ${call.status} | Duration: ${call.duration || 0}s`}
                        />
                        {call.status !== "ended" && (
                          <IconButton size="small" color="error" onClick={() => endCall(call._id)}>
                            <CallEnd />
                          </IconButton>
                        )}
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography>No calls found</Typography>
                )
              ) : (
                filteredCustomers.map((user) => (
                  <Box
                    key={user._id}
                    sx={{ p: 1, cursor: "pointer" }}
                    onClick={() => setSelectedUser(user)}
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      <StyledBadge overlap="circular" anchorOrigin={{ vertical: 'bottom', Horizontal: 'right' }}
                        variant={user?.is_active === true ? "dot" : "none"}>
                        <Avatar src={`${IMG_BASE_URL}/${user.profileImage}`} />
                      </StyledBadge>
                      <Typography>{user.name}</Typography>
                    </Stack>
                  </Box>
                ))
              )}
            </Box>
          </Card>
        </Grid>

        {/* Right Panel */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Card sx={{ height: "88vh",width:'100%' }}>
            {selectedUser && tab !== 2 ? (
              <Box>
                {/* Header */}
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ p: 1, backgroundColor: "#fdf4f4ff" }}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <StyledBadge overlap="circular" anchorOrigin={{ vertical: 'bottom', Horizontal: 'right' }}
                      variant={selectedUser?.is_active === true ? "dot" : "none"}>
                      <Avatar src={`${IMG_BASE_URL}/${selectedUser?.profileImage}`} />
                    </StyledBadge>
                    <Box>
                      <Typography variant="h6">{selectedUser.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Last seen: {renderTime(selectedUser.createdAt)}
                      </Typography>
                    </Box>
                  </Stack>
                  <Box sx={{display:'flex',alignItems:'center' ,gap:1}}>
                    <IconButton size="small" onClick={()=>startVideoCall(false)}>
                      <Call />
                    </IconButton>
                    <IconButton size="small" onClick={()=>startVideoCall(true)}>
                      <Videocam />
                    </IconButton>
                  </Box>
                </Stack>

                {/* Messages */}
                <Box sx={{ height: "67vh",scrollbarWidth:'none', "&::-webkit-scrollbar":{display:'none'}, overflowY: "auto", p: 1 }}>
                  {loadingMessages ? (
                    <ChatSkeleton variant="messages" />
                  ) : combinedMessages.length > 0 ? (
                    combinedMessages?.map((msg) => <ChatMessage key={msg._id} msg={msg} selectedUser={selectedUser} />)
                  ) : (
                    <Typography>No messages yet</Typography>
                  )}
                </Box>

                {/* Input */}
                <Stack direction="row" alignItems="center" sx={{ m: 1,}} spacing={1}>
                  <TextField
                    sx={{ flex: 1, border: "1px solid #ddd", borderRadius: "50px" }}
                    fullWidth
                    size="small"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type your message"
                  />
                  <IconButton onClick={handleSend}>
                    <Send />
                  </IconButton>
                </Stack>
              </Box>
            ) : (
              <Box sx={{display:'flex',alignItems:'center',justifyContent:'center',height:'100%',my:'auto'}}>
                <Typography variant="h6">No message available select user</Typography>
              </Box>
            )}
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 3 }}>
          <Profile />
        </Grid>
      </Grid>

      {isCallOpen && selectedUser && (
        <VideoCallModal
          open={isCallOpen}
          onClose={() => setIsCallOpen(false)}
          callType="outgoing"
          currentUserId={currentUserId}
          otherUserId={otherUserId}
          callerName="John Doe"
        />
      )}
    </>
  );
};

export default Chat;
