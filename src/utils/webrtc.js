// src/utils/webrtc.js
let localStream;
let remoteStream;
let peerConnection;
let iceCandidateCallback = null;
const servers = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };

export const initPeerConnection = () => {
  peerConnection = new RTCPeerConnection(servers);

  remoteStream = new MediaStream();

  peerConnection.ontrack = (event) => {
    event.streams[0].getTracks().forEach((track) => {
      remoteStream.addTrack(track);
    });
  };

  return { peerConnection, remoteStream };
};

export const getMediaStream = async () => {
  localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  return localStream;
};

export const addTracks = () => {
  localStream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, localStream);
  });
};

export const createOffer = async () => {
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  return offer;
};

export const createAnswer = async () => {
  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);
  return answer;
};

export const setRemoteDescription = async (desc) => {
  await peerConnection.setRemoteDescription(new RTCSessionDescription(desc));
};

export const addIceCandidate = async (candidate) => {
  await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
};

export const setIceCandidateCallback = (callback) => {
  iceCandidateCallback = callback;
};
export const closeConnection = () => {
  if (peerConnection) {
    peerConnection.close();
    peerConnection = null;
  }
  if (localStream) {
    localStream.getTracks().forEach((t) => t.stop());
  }
};
