import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5003", { transports: ["websocket"] });

export const useWebRTC = ({ currentUserId }) => {
  const pcRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const [incomingCall, setIncomingCall] = useState(null);
  const [callStarted, setCallStarted] = useState(false);
  const [callTimer, setCallTimer] = useState(0);
  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const timerRef = useRef(null);
  const [activeRoomId, setActiveRoomId] = useState(null);

  useEffect(() => {
    socket.emit("join-user", currentUserId);

    socket.on("call:incoming", ({ roomId, fromUserId, callerName, callId }) => {
      setIncomingCall({ roomId, fromUserId, callerName, callId });
    });

    socket.on("offer", async (offer) => {
      await pcRef.current.setRemoteDescription(new RTCSessionDescription(offer));
    });

    socket.on("answer", async (answer) => {
      await pcRef.current.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socket.on("ice-candidate", async (candidate) => {
      if (candidate) await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
    });

    socket.on("call-ended", () => {
      endCall();
    });

    return () => {
      socket.off("call:incoming");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
      socket.off("call-ended");
    };
  }, [currentUserId]);

  const initPeerConnection = async () => {
    pcRef.current = new RTCPeerConnection();

    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    if (localVideoRef.current) localVideoRef.current.srcObject = stream;

    stream.getTracks().forEach(track => pcRef.current.addTrack(track, stream));

    pcRef.current.ontrack = (event) => {
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = event.streams[0];
    };

    pcRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", { roomId: activeRoomId, candidate: event.candidate });
      }
    };
  };

  const startCall = async (targetUserId) => {
    const roomId = `room-${currentUserId}-${targetUserId}`;
    setActiveRoomId(roomId);
    await initPeerConnection();
    socket.emit("room:join", { roomId });

    const offer = await pcRef.current.createOffer();
    await pcRef.current.setLocalDescription(offer);

    socket.emit("call:initiate", { roomId, fromUserId: currentUserId, toUserId: targetUserId });
    socket.emit("offer", { roomId, offer });

    setCallStarted(true);
    startTimer();
  };

  const acceptCall = async () => {
    if (!incomingCall) return;
    const { roomId } = incomingCall;
    setActiveRoomId(roomId);

    await initPeerConnection();
    socket.emit("room:join", { roomId });

    await pcRef.current.setRemoteDescription(new RTCSessionDescription(incomingCall.offer));
    const answer = await pcRef.current.createAnswer();
    await pcRef.current.setLocalDescription(answer);

    socket.emit("call:accept", { roomId, callId: incomingCall.callId });
    socket.emit("answer", { roomId, answer });

    setIncomingCall(null);
    setCallStarted(true);
    startTimer();
  };

  const rejectCall = () => {
    if (!incomingCall) return;
    socket.emit("call:reject", { roomId: incomingCall.roomId, callId: incomingCall.callId });
    setIncomingCall(null);
  };

  const endCall = () => {
    const stream = localVideoRef.current?.srcObject;
    if (stream) stream.getTracks().forEach(track => track.stop());
    if (pcRef.current) pcRef.current.close();

    if (activeRoomId) socket.emit("call:end", { roomId: activeRoomId });

    stopTimer();
    setCallStarted(false);
    setIncomingCall(null);
    setActiveRoomId(null);
  };

  const toggleMute = () => {
    const stream = localVideoRef.current?.srcObject;
    if (!stream) return;
    stream.getAudioTracks().forEach(track => (track.enabled = !track.enabled));
    setMuted(prev => !prev);
  };

  const toggleCamera = () => {
    const stream = localVideoRef.current?.srcObject;
    if (!stream) return;
    stream.getVideoTracks().forEach(track => (track.enabled = !track.enabled));
    setCameraOff(prev => !prev);
  };

  const startTimer = () => {
    timerRef.current = setInterval(() => setCallTimer(prev => prev + 1), 1000);
  };

  const stopTimer = () => {
    clearInterval(timerRef.current);
    setCallTimer(0);
  };

  return {
    localVideoRef,
    remoteVideoRef,
    incomingCall,
    callStarted,
    callTimer,
    startCall,
    acceptCall,
    rejectCall,
    endCall,
    toggleMute,
    toggleCamera,
    muted,
    cameraOff
  };
};
