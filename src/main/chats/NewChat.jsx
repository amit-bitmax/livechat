import React, { useRef, useState, useMemo, useEffect } from "react";
import {
  Box,
  Tabs,
  Tab,
  Card,
  Grid,
  Avatar,
  OutlinedInput,
  InputAdornment,
  Typography,
  Stack,
  IconButton,
  TextField,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText
} from "@mui/material";
import { Search, Send, Videocam, CallEnd } from "@mui/icons-material";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import VideoCallModal from "../../calls/VideoCallModal";
import {
  useGetAllCustomerQuery,
  useGetConversationQuery,
  useSendMessageMutation
} from "../../features/chat/newChatApi";
import {
  useCreateCallMutation,
  useUpdateCallStatusMutation,
  useGetCallHistoryQuery
} from "../../features/room/roomApi";
import renderTime from "../../utils/renderTime";
import { getSockets } from "../../features/sockets/socketService";

const IMG_BASE_URL = "http://localhost:5003/uploads/profile";

const ChatMessage = ({ msg, agentId }) => {
  const isAgentSender = msg?.from?._id === agentId;
  return (
    <Box mb={1} display="flex" justifyContent={isAgentSender ? "flex-end" : "flex-start"}>
      <Stack direction="row" sx={{ flexDirection: isAgentSender ? "row-reverse" : "row" }}>
        <Avatar
          alt={isAgentSender ? msg?.from?.name : msg?.to?.name}
          src={
            isAgentSender && msg?.from?.profileImage
              ? `${IMG_BASE_URL}/${msg.from.profileImage}`
              : msg?.to?.profileImage
              ? `${IMG_BASE_URL}/${msg.to.profileImage}`
              : ""
          }
        />
        <Box>
          <Box
            sx={{
              mt: 0.2,
              backgroundColor: isAgentSender ? "#cbe2ddff" : "#d9efc1ff",
              p: 1,
              px: 2,
              mx: 1,
              borderRadius: 2,
              maxWidth: 300
            }}
          >
            <Typography variant="body1">{msg.message}</Typography>
          </Box>
          <Typography variant="body2" sx={{ fontSize: "10px", mt: 1, ml: 1 }}>
            {renderTime(msg?.createdAt)}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
};

export default function NewChat({ currentUserId }) {
  const [tab, setTab] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const token = localStorage.getItem("token");
  const decoded = token ? jwtDecode(token) : null;
  const agentId = decoded?.id;

  // ✅ Video Call State
  const [isCallOpen, setIsCallOpen] = useState(false);
  const [targetUserId, setTargetUserId] = useState(null);
  const [roomId, setRoomId] = useState(null);

  // ✅ API Hooks
  const [sendMessage] = useSendMessageMutation();
  const { data: customerData } = useGetAllCustomerQuery();
  const { data: messagesData, isLoading: loadingMessages } = useGetConversationQuery(
    selectedUser?._id,
    { skip: !selectedUser }
  );
  const { data: callsData, isLoading: loadingCalls } = useGetCallHistoryQuery();
  const [createCall] = useCreateCallMutation();
  const [updateCallStatus] = useUpdateCallStatusMutation();

  const customers = customerData?.data || [];
  const messages = messagesData?.data?.messages || [];
  const conversationId = messagesData?.data?._id;
  const calls = callsData?.data || [];
  // fliter customer
  const filteredCustomers = useMemo(() => {
    return customers.filter(
      (user) =>
        (tab === 0 || user?.is_active) &&
        (user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user?.email?.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [customers, tab, searchQuery]);

  // ✅ Typing socket listener
  useEffect(() => {
    const { presenceSocket } = getSockets();
    if (!presenceSocket) return;

    presenceSocket.on("user-typing", ({ fromUserId, typing }) => {
      if (fromUserId === selectedUser?._id) setIsTyping(typing);
    });

    return () => {
      presenceSocket.off("user-typing");
    };
  }, [selectedUser]);

  const handleTyping = (value) => {
    setText(value);
    const { presenceSocket } = getSockets();
    presenceSocket?.emit(value ? "start-typing" : "stop-typing", {
      toUserId: selectedUser?._id
    });
  };

  const handleSend = async () => {
    if (!text.trim()) return toast.error("Message cannot be empty");
    if (!conversationId) return toast.error("No conversation found");

    try {
      await sendMessage({
        conversationId,
        from: agentId,
        to: selectedUser,
        message: text
      }).unwrap();

      setText("");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to send");
    }
  };

  // ✅ Start Video Call
  const startVideoCall = async () => {
    if (!selectedUser) return toast.error("Select a user first");
    try {
      const newRoomId = `room-${agentId}-${selectedUser._id}`;
      await createCall({
        roomId: newRoomId,
        callerId: agentId,
        receiverId: selectedUser._id
      }).unwrap();
      setRoomId(newRoomId);
      setTargetUserId(selectedUser._id);
      setIsCallOpen(true);
      toast.success("Video call started");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to start call");
    }
  };

  // ✅ End Video Call
  const endCall = async (id) => {
    try {
      await updateCallStatus({ roomId: id, status: "ended" }).unwrap();
      toast.info("Call ended");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to end call");
    }
  };

  return (
    <>
      <Grid container spacing={1}>
        {/* Left Panel */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ p: 2 }}>
            <Tabs value={tab} onChange={(e, val) => setTab(val)} variant="fullWidth" sx={{ mb: 1 }}>
              <Tab label="Messages" />
              <Tab label="Active" />
              <Tab label="Calls" />
            </Tabs>
            {tab !== 2 && (
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
            )}
            <Box sx={{ height: "69vh", overflowY: "auto" }}>
              {tab === 2 ? (
                loadingCalls ? (
                  <CircularProgress />
                ) : calls.length > 0 ? (
                  <List>
                    {calls.map((call) => (
                      <ListItem key={call._id} divider>
                        <ListItemAvatar>
                          <Avatar>{call.participants[0]?.userId?.name?.charAt(0)}</Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={`Room: ${call.roomId}`}
                          secondary={`Status: ${call.status} | Duration: ${call.duration || 0}s`}
                        />
                        {call.status !== "ended" && (
                          <IconButton color="error" onClick={() => endCall(call._id)}>
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
                      <Avatar src={`${IMG_BASE_URL}/${user.profileImage}`} />
                      <Typography>{user.name}</Typography>
                    </Stack>
                  </Box>
                ))
              )}
            </Box>
          </Card>
        </Grid>

        {/* Right Panel */}
        <Grid item xs={12} lg={8}>
          <Card>
            {selectedUser && tab !== 2 ? (
              <Box>
                {/* Header */}
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2 }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar
                      src={`${IMG_BASE_URL}/${selectedUser.profileImage}`}
                      sx={{ width: 48, height: 48 }}
                    />
                    <Box>
                      <Typography variant="h6">{selectedUser.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {isTyping ? "Typing..." : `Last seen: ${renderTime(selectedUser.login_time)}`}
                      </Typography>
                    </Box>
                  </Stack>
                  <IconButton onClick={startVideoCall}>
                    <Videocam />
                  </IconButton>
                </Stack>

                {/* Messages */}
                <Box sx={{ height: "63vh", overflowY: "auto", p: 1 }}>
                  {loadingMessages ? (
                    <Typography>Loading...</Typography>
                  ) : messages.length > 0 ? (
                    messages.map((msg) => (
                      <ChatMessage key={msg._id} msg={msg} agentId={agentId} />
                    ))
                  ) : (
                    <Typography>No messages yet</Typography>
                  )}
                </Box>

                {/* Input */}
                <Stack direction="row" alignItems="center" sx={{ p: 1 }} spacing={1}>
                  <TextField
                    fullWidth
                    size="small"
                    value={text}
                    onChange={(e) => handleTyping(e.target.value)}
                    placeholder="Type your message"
                  />
                  <IconButton onClick={handleSend}>
                    <Send />
                  </IconButton>
                </Stack>
              </Box>
            ) : (
              <Box sx={{ height: "86vh" }}>
                <Typography sx={{ p: 2 }}>Select a user to start chatting</Typography>
              </Box>
            )}
          </Card>
        </Grid>
      </Grid>

      {/* ✅ Video Call Modal */}
      {isCallOpen && (
        <VideoCallModal
          open={isCallOpen}
          onClose={() => setIsCallOpen(false)}
          roomId={roomId}
          callerId={agentId}
          receiverId={targetUserId}
        />
      )}
    </>
  );
}
