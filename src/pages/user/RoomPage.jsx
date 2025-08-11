import React, { useEffect, useRef, useState } from "react";

import { Button } from "@mui/material";
import { io } from "socket.io-client";

const socket = io('http://localhost:5003', {transports: ['websocket'],});
const AgentCall = () => {
  const [roomId, setRoomId] = useState("room123");
  const [inCall, setInCall] = useState(false);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const pc = useRef(null);

  useEffect(() => {
    socket.emit("room:join", { roomId, userId: "agent" });

    socket.on("incoming:call", async ({ fromUserId, offer }) => {
      console.log("Incoming call from:", fromUserId);
      // Agent will not auto-accept
      alert(`Incoming call from ${fromUserId}`);
    });

    socket.on("call:accepted", async ({ answer }) => {
      await pc.current.setRemoteDescription(new RTCSessionDescription(answer));
      console.log("Call accepted!");
    });

    socket.on("ice-candidate", ({ candidate }) => {
      pc.current.addIceCandidate(new RTCIceCandidate(candidate));
    });

    socket.on("call-ended", () => {
      endCall();
    });

    return () => socket.off();
  }, [roomId]);

  const startCall = async () => {
    setInCall(true);
    pc.current = new RTCPeerConnection();
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideoRef.current.srcObject = stream;

    stream.getTracks().forEach(track => pc.current.addTrack(track, stream));

    pc.current.ontrack = (event) => {
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    pc.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", { roomId, candidate: event.candidate });
      }
    };

    const offer = await pc.current.createOffer();
    await pc.current.setLocalDescription(offer);

    socket.emit("user:call", { roomId, fromUserId: "agent", offer });
  };

  const endCall = () => {
    if (pc.current) {
      pc.current.close();
      pc.current = null;
    }
    setInCall(false);
    socket.emit("leave-room", { roomId });
  };

  return (
    <div>
      <h2>Agent Panel</h2>
      <video ref={localVideoRef} autoPlay muted playsInline width="300"></video>
      <video ref={remoteVideoRef} autoPlay playsInline width="300"></video>
      {!inCall ? (
        <Button variant="contained" onClick={startCall}>Start Call</Button>
      ) : (
        <Button variant="outlined" color="error" onClick={endCall}>End Call</Button>
      )}
    </div>
  );
};

export default AgentCall;
