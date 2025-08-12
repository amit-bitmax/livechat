import { useState } from "react";
import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ReplyIcon from "@mui/icons-material/Reply";
import ForwardIcon from "@mui/icons-material/Forward";
import DeleteIcon from "@mui/icons-material/Delete";
import { useReplyToPetitionMutation, useTransferPetitionMutation } from "../../../features/chat/chatApi";

export default function ChatReply({ petitionId }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState("");

  const [replyToPetition] = useReplyToPetitionMutation(petitionId, replyText);
  const [transferPetition] = useTransferPetitionMutation();

  const handleOpenMenu = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  const handleReply = () => {
    setReplyOpen(true);
    handleCloseMenu();
  };

  const handleSendReply = async () => {
    if (!replyText.trim()) return;
    try {
      await replyToPetition({ petitionId, message: replyText }).unwrap();
      setReplyText("");
      setReplyOpen(false);
    } catch (err) {
      console.error("Reply failed", err);
    }
  };

  const handleTransfer = async () => {
    const newAgentId = prompt("Enter new agent ID:");
    if (!newAgentId) return;
    try {
      await transferPetition({ petitionId, newAgentId }).unwrap();
    } catch (err) {
      console.error("Transfer failed", err);
    }
  };

  return (
    <>
      <Box sx={{ position: "relative" }}>
        <IconButton onClick={handleOpenMenu}>
          <MoreVertIcon fontSize="small" />
        </IconButton>
      </Box>

      <Menu
        elevation={0}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        PaperProps={{
          sx: { mt: 1, backgroundColor: "#f6f8faff" },
        }}
      >
        <MenuItem onClick={handleReply}>
          <ListItemIcon>
            <ReplyIcon sx={{ color: "#111" }} fontSize="small" />
          </ListItemIcon>
          <ListItemText sx={{ color: "#111" }}>Reply</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleTransfer}>
          <ListItemIcon>
            <ForwardIcon sx={{ color: "#111" }} fontSize="small" />
          </ListItemIcon>
          <ListItemText sx={{ color: "#111" }}>Transfer</ListItemText>
        </MenuItem>

        <MenuItem>
          <ListItemIcon>
            <DeleteIcon sx={{ color: "#111" }} fontSize="small" />
          </ListItemIcon>
          <ListItemText sx={{ color: "#111" }}>Delete</ListItemText>
        </MenuItem>
      </Menu>

      {/* Reply Dialog */}
      <Dialog open={replyOpen} onClose={() => setReplyOpen(false)}>
        <DialogTitle>Reply to Petition</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            multiline
            minRows={3}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Type your reply..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReplyOpen(false)}>Cancel</Button>
          <Button onClick={handleSendReply} variant="contained">
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
