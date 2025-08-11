// components/AgentCall.js
import React, { useEffect, useRef, useState } from 'react';

import { toast } from 'react-toastify';
import { useCreateCallMutation, useUpdateCallStatusMutation } from '../../features/room/roomApi';
import useWebRTC from '../../hooks/useWebRTC';

const AgentCall = ({ customerId }) => {
  const [createCall] = useCreateCallMutation();
  const [updateCallStatus] = useUpdateCallStatusMutation();
  const [roomId, setRoomId] = useState(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  
  const { localStream, isCallActive, setupWebRTC, startCall, endCall } = useWebRTC(
    roomId,
    'agent',
    (stream) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream;
      }
    }
  );

  useEffect(() => {
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  const initiateCall = async () => {
    try {
      const response = await createCall(customerId).unwrap();
      setRoomId(response.data.roomId);
      await setupWebRTC();
      toast.success('Call initiated!');
    } catch (err) {
      toast.error('Failed to initiate call: ' + err.data?.message || err.message);
    }
  };

  const handleStartCall = async () => {
    await startCall(true);
    await updateCallStatus({ roomId, status: 'accepted' });
  };

  const handleEndCall = async () => {
    await endCall();
    if (roomId) {
      await updateCallStatus({ roomId, status: 'ended' });
    }
    toast.info('Call ended');
  };

  return (
    <div className="call-container">
      <div className="video-container">
        <video ref={remoteVideoRef} autoPlay playsInline className="remote-video" />
        <video ref={localVideoRef} autoPlay playsInline muted className="local-video" />
      </div>
      
      <div className="call-controls">
        {!roomId ? (
          <button onClick={initiateCall} className="call-button">
            Start Video Call
          </button>
        ) : !isCallActive ? (
          <button onClick={handleStartCall} className="call-button">
            Connect Call
          </button>
        ) : (
          <button onClick={handleEndCall} className="end-call-button">
            End Call
          </button>
        )}
      </div>
    </div>
  );
};

export default AgentCall;