import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  Box,
  IconButton,
  Stack,
  Typography,
  Paper,
} from "@mui/material";
import {
  Mic,
  MicOff,
  Videocam,
  VideocamOff,
  CallEnd,
  Fullscreen,
  FullscreenExit,
} from "@mui/icons-material";
import { closeConnection } from "../utils/webrtc";
import { useUpdateCallStatusMutation } from "../features/room/roomApi";
import { toast } from "react-toastify";

const VideoCallModal = ({
  open,
  onEnd,
  localStream,
  remoteStream,
  callAccepted,
  roomId, 
}) => {
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const containerRef = useRef();
  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const timerRef = useRef(null);

  const [updateCallStatus] = useUpdateCallStatusMutation(); // ✅ RTK mutation

  useEffect(() => {
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [localStream, remoteStream]);

  useEffect(() => {
    if (open && callAccepted) {
      timerRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      clearInterval(timerRef.current);
      setElapsedTime(0);
    };
  }, [open, callAccepted]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  const handleEnd = async () => {
    clearInterval(timerRef.current);
    closeConnection();

    try {
      if (roomId) {
        await updateCallStatus({ roomId, status: "ended" }); 
        toast.success("Call Ended");
        console.log("✅ Call status updated to 'ended'");
      }
    } catch (err) {
      console.error("❌ Failed to update call status:", err);
    }

    onEnd();
  };

  const toggleMute = () => {
    localStream?.getAudioTracks().forEach((track) => (track.enabled = !track.enabled));
    setMuted(!muted);
  };

  const toggleCamera = () => {
    localStream?.getVideoTracks().forEach((track) => (track.enabled = !track.enabled));
    setCameraOff(!cameraOff);
  };

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  if (!open) return null;

  return (
    <Modal open={open} sx={{ background: "transparent", }} onClose={handleEnd}>
      <Box
        sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}
      >
        <Paper
          ref={containerRef}
          elevation={0}
          sx={{
            position: "relative",
            width: {xs:'70%',lg:"30vw"},
            maxWidth: 1000,
            height: "85vh",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Remote video */}
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            style={{ flex: 1, objectFit: "cover", width: "100%" }}
          />
          <Typography
            variant="caption"
            sx={{
              position: "absolute",
              top: 16,
              left: 16,
              color: "#fff",
              background: "rgba(0,0,0,0.5)",
              px: 1,
              borderRadius: 1,
            }}
          >
            Receiver
          </Typography>

          {/* Local video */}
          <Box
            sx={{
              position: "absolute",
              top: 50,
              right: 20,
              borderRadius: 2,
              overflow: "hidden",
              border: "1px solid #fff",
              width: 120,
              height: 150,
              zIndex: 10,
            }}
          >
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <Typography
              variant="caption"
              sx={{
                position: "absolute",
                bottom: 4,
                left: 4,
                color: "#fff",
                background: "rgba(0,0,0,0.5)",
                px: 1,
                borderRadius: 1,
              }}
            >
              You
            </Typography>
          </Box>

          {/* Call duration */}
          <Typography
            variant="body2"
            sx={{
              position: "absolute",
              top: 10,
              left: "50%",
              transform: "translateX(-50%)",
              color: "#fff",
              backgroundColor: "rgba(0,0,0,0.5)",
              padding: "2px 8px",
              borderRadius: "6px",
            }}
          >
            {formatTime(elapsedTime)}
          </Typography>

          {/* Controls */}
          <Stack
            direction="row"
            justifyContent="center"
            spacing={2}
            sx={{ position: "absolute", bottom: 16, width: "100%", zIndex: 20 }}
          >
            <IconButton onClick={toggleMute} sx={{ color: "#fff" }}>
              {muted ? <MicOff /> : <Mic />}
            </IconButton>
            <IconButton onClick={toggleCamera} sx={{ color: "#fff" }}>
              {cameraOff ? <VideocamOff /> : <Videocam />}
            </IconButton>
            <IconButton onClick={handleEnd} sx={{ color: "red" }}>
              <CallEnd />
            </IconButton>
            <IconButton onClick={toggleFullscreen} sx={{ color: "#fff" }}>
              {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
            </IconButton>
          </Stack>
        </Paper>
      </Box>
    </Modal>
  );
};

export default VideoCallModal;
