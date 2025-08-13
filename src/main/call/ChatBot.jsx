import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Stack,
  Avatar,
  Divider,
} from "@mui/material";
import { toast } from "react-toastify";
import { useSendMessageMutation } from "../../features/chat/newChatApi";
import { format } from "date-fns";

const IMG_BASE_URL = "http://localhost:5003/uploads/profile";

export default function ChatWindow({ conversationId, customer }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [sendMessage, { isLoading }] = useSendMessageMutation();
  const messagesEndRef = useRef(null);

  // ✅ Send message
  const handleSend = async () => {
    if (!message.trim()) return;
    try {
      const res = await sendMessage({ conversationId, message }).unwrap();
      setMessages(res.data.messages);
      setMessage("");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to send message");
    }
  };

  // ✅ Scroll to bottom on messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ Format timestamp
  const formatTime = useCallback((date) => format(new Date(date), "hh:mm a"), []);

  return (
    <Paper
      sx={{
        maxWidth: 500,
        mx: "auto",
        mt: 4,
        display: "flex",
        flexDirection: "column",
        height: 600,
        borderRadius: 2,
        backdropFilter: "blur(10px)",
        background: "rgba(255,255,255,0.9)",
      }}
      elevation={4}
    >
      {/* ✅ Header */}
      <Box sx={{ display: "flex", alignItems: "center", p: 2, borderBottom: "1px solid #ddd" }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar src={`${IMG_BASE_URL}/${customer?.profileImage || "default.png"}`} />
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              {customer?.name || "Customer"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {customer?.email} • {customer?.mobile}
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* ✅ Messages Section */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {messages.length === 0 ? (
          <Typography variant="body2" color="text.secondary" textAlign="center">
            Say hello 👋
          </Typography>
        ) : (
          messages.map((msg, index) => {
            const isCustomer = msg.senderRole === "customer";

            return (
              <Stack
                key={index}
                direction={isCustomer ? "row" : "row-reverse"}
                spacing={1}
                alignItems="flex-end"
              >
                {/* Avatar */}
                <Avatar
                  src={
                    isCustomer
                      ? `${IMG_BASE_URL}/${customer?.profileImage || "default.png"}`
                      : `${IMG_BASE_URL}/agent-avatar.png`
                  }
                  sx={{ width: 32, height: 32 }}
                />

                {/* Message Bubble */}
                <Box
                  sx={{
                    bgcolor: isCustomer ? "#f1f1f1" : "#1976d2",
                    color: isCustomer ? "#000" : "#fff",
                    px: 2,
                    py: 1,
                    borderRadius: 3,
                    maxWidth: "70%",
                  }}
                >
                  <Typography variant="body2">{msg.message}</Typography>
                  <Typography
                    variant="caption"
                    sx={{ display: "block", textAlign: "right",color:'#b8a9a9ff', opacity: 0.5 }}
                  >
                    {formatTime(msg.createdAt)}
                  </Typography>
                </Box>
              </Stack>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </Box>

      <Divider />

      {/* ✅ Input Section */}
      <Stack direction="row" spacing={1} sx={{ p: 2 }}>
        <TextField
          fullWidth
          size="small"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
        />
        <Button variant="contained" color="primary" onClick={handleSend} disabled={isLoading}>
          Send
        </Button>
      </Stack>
    </Paper>
  );
}
