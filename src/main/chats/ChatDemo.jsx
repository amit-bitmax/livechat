import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useGetMessagesQuery, useSendMessageMutation } from "../../features/chat/chatApi";

function ChatDemo() {
  const { data: messages, isLoading } = useGetMessagesQuery();
  const [sendMessage] = useSendMessageMutation();
  const [number, setNumber] = useState("");
  const [text, setText] = useState("");

  const handleSend = async () => {
    if (!number || !text) return;
    await sendMessage({ to: number, message: text });
    setText("");
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>WhatsApp Agent Chat</Typography>

      <TextField
        label="Customer WhatsApp Number"
        fullWidth
        sx={{ my: 2 }}
        value={number}
        onChange={(e) => setNumber(e.target.value)}
      />

      <TextField
        label="Your Message"
        fullWidth
        value={text}
        onChange={(e) => setText(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Button variant="contained" onClick={handleSend}>
        Send to WhatsApp
      </Button>

      <Typography variant="h6" sx={{ mt: 4 }}>Message History</Typography>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <List>
          {messages?.map((msg, i) => (
            <ListItem key={i}>
              <ListItemText
                primary={`${msg.from} → ${msg.to}: ${msg.message}`}
                secondary={new Date(msg.createdAt).toLocaleString()}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Container>
  );
}

export default ChatDemo;
