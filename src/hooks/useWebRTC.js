import { useEffect, useRef, useState, useCallback } from "react";
import { io } from "socket.io-client";

export default function useWebRTC(userId) {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [callStatus, setCallStatus] = useState("idle");
  const [callerInfo, setCallerInfo] = useState(null);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const socketRef = useRef(null);
  const peerConnectionRef = useRef(null);

  /** ===========================
   *  1. Initialize Socket & Media
   * =========================== */
  useEffect(() => {
    const init = async () => {
      try {
        socketRef.current = io("http://localhost:5003", {
          transports: ["websocket"],
          auth: { token: localStorage.getItem("token") },
        });

        socketRef.current.emit("join-user", userId);

        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        setLocalStream(stream);
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;

        setupSocketListeners();
      } catch (err) {
        console.error("Initialization error:", err);
      }
    };

    init();

    return cleanup;
  }, [userId]);

  /** ===========================
   *  2. Setup Socket Listeners
   * =========================== */
  const setupSocketListeners = () => {
    const socket = socketRef.current;

    const listeners = {
      "call:incoming": (data) => {
        setCallerInfo({
          fromUserId: data.fromUserId,
          name: data.callerName,
          callId: data.callId,
          roomId: data.roomId,
          offer: data.offer,
        });
        setCallStatus("ringing");
      },
      "call:accepted": () => setCallStatus("ongoing"),
      "call-ended": () => endCall(),
      "call:error": (err) => {
        console.error("Call error:", err);
        setCallStatus("error");
      },
      offer: handleReceiveOffer,
      answer: handleReceiveAnswer,
      "ice-candidate": handleNewICECandidate,
    };

    Object.entries(listeners).forEach(([event, handler]) =>
      socket.on(event, handler)
    );

    return () => {
      Object.keys(listeners).forEach((event) => socket.off(event));
    };
  };

  /** ===========================
   *  3. Initialize PeerConnection
   * =========================== */
  const initializePeerConnection = useCallback(() => {
    if (peerConnectionRef.current) return;

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    if (localStream) {
      localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));
    }

    pc.onicecandidate = (event) => {
      if (event.candidate && callerInfo?.roomId) {
        socketRef.current.emit("ice-candidate", {
          roomId: callerInfo.roomId,
          candidate: event.candidate,
        });
      }
    };

    pc.ontrack = (event) => {
      const stream = event.streams[0];
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = stream;
      setRemoteStream(stream);
    };

    peerConnectionRef.current = pc;
  }, [localStream, callerInfo?.roomId]);

  /** ===========================
   *  4. Handle Incoming Offer (Receiver)
   * =========================== */
  const handleReceiveOffer = useCallback(async ({ offer, roomId, callId }) => {
    initializePeerConnection();
    const pc = peerConnectionRef.current;

    await pc.setRemoteDescription(new RTCSessionDescription(offer));

    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    socketRef.current.emit("call:accept", { roomId, callId, answer });
    setCallStatus("ongoing");
  }, [initializePeerConnection]);

  /** ===========================
   *  5. Handle Incoming Answer (Caller)
   * =========================== */
  const handleReceiveAnswer = useCallback(async ({ answer }) => {
    if (peerConnectionRef.current) {
      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
      setCallStatus("ongoing");
    }
  }, []);

  /** ===========================
   *  6. Handle ICE Candidates
   * =========================== */
  const handleNewICECandidate = useCallback(async ({ candidate }) => {
    try {
      if (peerConnectionRef.current && candidate) {
        await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      }
    } catch (err) {
      console.error("Error adding ICE candidate:", err);
    }
  }, []);

  /** ===========================
   *  7. Start Call (Caller)
   * =========================== */
  const startCall = useCallback(async (toUserId) => {
    const response = await createCall({ receiverId: toUserId }).unwrap();
    const { roomId, _id: callId } = response?.data;
    setCallerInfo({ roomId, toUserId });
    setCallStatus("calling");

    initializePeerConnection();
    const pc = peerConnectionRef.current;

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    socketRef.current.emit("call:initiate", {
      roomId,
      fromUserId: userId,
      toUserId,
      offer,
    });
  }, [initializePeerConnection, userId]);

  /** ===========================
   *  8. Accept Call (Receiver)
   * =========================== */
  const acceptCall = useCallback(async () => {
    if (!callerInfo) return;
    await handleReceiveOffer({ offer: callerInfo.offer, roomId: callerInfo.roomId, callId: callerInfo.callId });
  }, [callerInfo, handleReceiveOffer]);

  /** ===========================
   *  9. End Call
   * =========================== */
  const endCall = useCallback(() => {
    if (callerInfo?.roomId) {
      socketRef.current.emit("call:end", {
        roomId: callerInfo.roomId,
        callId: callerInfo.callId,
      });
    }
    cleanup();
  }, [callerInfo]);

  /** ===========================
   * 10. Cleanup Resources
   * =========================== */
  const cleanup = useCallback(() => {
    peerConnectionRef.current?.close();
    peerConnectionRef.current = null;

    if (localStream) localStream.getTracks().forEach((track) => track.stop());
    setLocalStream(null);
    setRemoteStream(null);
    setCallStatus("idle");
    setCallerInfo(null);

    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  }, [localStream]);

  return {
    localStream,
    remoteStream,
    callStatus,
    callerInfo,
    localVideoRef,
    remoteVideoRef,
    startCall,
    acceptCall,
    endCall,
  };
}
