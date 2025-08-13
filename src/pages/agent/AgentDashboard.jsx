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
  setCallOpen(true);

  try {
    // ✅ Backend me call create karein, backend roomId return karega
    const res = await createCall({ receiverId: customerId }).unwrap();

    const backendRoomId = res?.data?.roomId;
     console.log("roomId:", backendRoomId);
    setRoomId(backendRoomId);

    // ✅ Socket se call initiate karein
    initiateCall({
      roomId: backendRoomId,
      callerId: agentId,
      receiverId: customerId,
      offer
    });
  } catch (error) {
    console.error("❌ API error while creating call:", error);
  }
};



  return (
    <>
      <button onClick={startCall}>Call Customer</button>
      <VideoCallModal open={callOpen} onEnd={() => setCallOpen(false)} localStream={localStream} remoteStream={remoteStream} callAccepted={onCallAccepted} roomId={roomId} />
    </>
  );
};

export default AgentDashboard;
