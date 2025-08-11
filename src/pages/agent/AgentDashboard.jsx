import React, { useEffect, useState } from "react";
import { initSocket, joinUserRoom, initiateCall, onCallAccepted, onIceCandidate, onAnswer } from "../../socket/callSocket";
import { initPeerConnection, getMediaStream, addTracks, createOffer, setRemoteDescription, addIceCandidate, setIceCandidateCallback } from "../../utils/webrtc";
import VideoCallModal from "../../calls/VideoCallModal";
import { useCreateCallMutation } from "../../features/room/roomApi";

const AgentDashboard = () => {
  const agentId = "687608347057ea1dfefa7de0"; 
  const customerId = "687d2775dbe0e848c9e791ab";
  const [callOpen, setCallOpen] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [createCall] = useCreateCallMutation();

  useEffect(() => {
    const socket = initSocket();
    joinUserRoom(agentId);

    onCallAccepted(() => console.log("Call accepted by customer"));
    onAnswer(async (answer) => await setRemoteDescription(answer));
    onIceCandidate(async (candidate) => await addIceCandidate(candidate));

    setIceCandidateCallback((candidate) => {
      socket.emit("ice-candidate", { roomId, candidate });
    });
  }, [roomId]);

  const startCall = async () => {
  const { peerConnection, remoteStream: rs } = initPeerConnection();
  setRemoteStream(rs);

  const stream = await getMediaStream();
  setLocalStream(stream);
  addTracks();

  const offer = await createOffer();
  const roomId = crypto.randomUUID(); // or use any UUID method
  setRoomId(roomId);
  setCallOpen(true);

  // ✅ 1. Save to backend
  try {
    await createCall({
      receiverId: customerId,
    }).unwrap();
    console.log("📞 Call saved to DB");
  } catch (error) {
    console.error("❌ API error while creating call:", error);
  }

  // ✅ 2. Trigger signaling via socket
  initiateCall({ roomId, fromUserId: agentId, toUserId: customerId, offer });
};


  return (
    <>
      <button onClick={startCall}>Call Customer</button>
      <VideoCallModal open={callOpen} onEnd={() => setCallOpen(false)} localStream={localStream} remoteStream={remoteStream} callAccepted={onCallAccepted} />
    </>
  );
};

export default AgentDashboard;
