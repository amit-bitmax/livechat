import React, { useRef } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { io } from "socket.io-client";
import { useCreateCallMutation } from "../../features/room/roomApi";
import VideoCallModal from "../../calls/VideoCallModal";

const AgentCallPage = ({ currentUserId }) => {
  const [receiverId, setReceiverId] = React.useState("");
  const [modalOpen, setModalOpen] = React.useState(false);
  const [roomId, setRoomId] = React.useState(null);
  const [otherUserId, setOtherUserId] = React.useState(null);
  const socketRef = useRef(null);

  const [createCall] = useCreateCallMutation();

  React.useEffect(() => {
    socketRef.current = io("http://localhost:5003", {
      auth: { token: localStorage.getItem("token") },
    });
    socketRef.current.emit("join-user", currentUserId);

    return () => {
      socketRef.current.disconnect();
    };
  }, [currentUserId]);

  const handleStartCall = async () => {
    try {
      const response = await createCall({ receiverId }).unwrap();
      const room = response.data;
      setRoomId(room.roomId);
      setOtherUserId(receiverId);

      socketRef.current.emit("call:initiate", {
        roomId: room.roomId,
        fromUserId: currentUserId,
        toUserId: receiverId,
      });

      setModalOpen(true);
    } catch (error) {
      console.error("Error creating call:", error);
    }
  };

  return (
    <Box sx={{ textAlign: "center", mt: 5 }}>
      <Typography variant="h4" mb={2}>Agent Dashboard</Typography>
      <TextField
        label="Enter Customer ID"
        variant="outlined"
        value={receiverId}
        onChange={(e) => setReceiverId(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Button variant="contained" color="primary" onClick={handleStartCall}>
        Start Call
      </Button>

      {/* Video Call Modal */}
      {modalOpen && (
        <VideoCallModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          callType="ringing"
          currentUserId={currentUserId}
          otherUserId={otherUserId}
          roomId={roomId}
        />
      )}
    </Box>
  );
};

export default AgentCallPage;
