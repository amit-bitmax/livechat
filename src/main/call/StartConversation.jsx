import React, { useState } from "react";
import { Box, TextField, Typography, Paper, CircularProgress } from "@mui/material";
import { toast } from "react-toastify";
import { useStartConversationMutation } from "../../features/chat/newChatApi";

export default function StartConversation({ onStart }) {
  const questions = [
    { key: "name", label: "What is your name?" },
    { key: "email", label: "What is your email?" },
    { key: "mobile", label: "What is your mobile number?" },
    { key: "department", label: "Which department do you need help with?" },
    { key: "query", label: "Please describe your query" }
  ];

  const [step, setStep] = useState(0);
  const [form, setForm] = useState({});
  const [input, setInput] = useState("");
  const [startConversation, { isLoading }] = useStartConversationMutation();

  const handleKeyPress = async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      if (!input.trim()) {
        toast.warning("Please provide an answer");
        return;
      }

      const key = questions[step].key;
      const updatedForm = { ...form, [key]: input };

      setForm(updatedForm);
      setInput("");

      if (step < questions.length - 1) {
        setStep(step + 1);
      } else {
        // ✅ Last question answered → Start conversation
        try {
          const res = await startConversation(updatedForm).unwrap();
          toast.success("Conversation started!");
          onStart(res.data._id);
        } catch (err) {
          toast.error(err.data?.message || "Failed to start conversation");
        }
      }
    }
  };

  return (
    <Paper
      sx={{
        maxWidth: 400,
        mx: "auto",
        mt: 4,
        p: 3,
        borderRadius: 2,
        backdropFilter: "blur(10px)",
        background: "rgba(255,255,255,0.8)",
        textAlign: "center"
      }}
      elevation={4}
    >
      <Typography variant="h6" gutterBottom>
        Start Chat
      </Typography>

      <Typography variant="body1" sx={{ mb: 2 }}>
        {questions[step].label}
      </Typography>

      <TextField
        fullWidth
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyPress} // ✅ Press Enter to move next
        placeholder="Type your answer..."
        disabled={isLoading}
      />

      {isLoading && (
        <Box sx={{ mt: 2 }}>
          <CircularProgress size={24} />
          <Typography variant="caption" sx={{ ml: 1 }}>
            Starting chat...
          </Typography>
        </Box>
      )}
    </Paper>
  );
}
