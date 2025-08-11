// src/socket/callSocket.js
import { io } from "socket.io-client";

let socket;

export const initSocket = (token) => {
  socket = io("http://localhost:5003", {
    auth: { token },
    transports: ["websocket"],
  });

  socket.on("connect", () => {
    console.log("✅ Socket connected:", socket.id);
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected");
  });

  return socket;
};

export const joinUserRoom = (userId) => {
  if (socket) socket.emit("join-user", userId);
};

export const initiateCall = (data) => socket.emit("call:initiate", data);
export const acceptCall = (data) => socket.emit("call:accept", data);
export const endCall = (data) => socket.emit("call:end", data);
export const sendOffer = (data) => socket.emit("offer", data);
export const sendAnswer = (data) => socket.emit("answer", data);
export const sendIceCandidate = (data) => socket.emit("ice-candidate", data);

export const onIncomingCall = (cb) => socket.on("call:incoming", cb);
export const onCallAccepted = (cb) => socket.on("call:accepted", cb);
export const onCallEnded = (cb) => socket.on("call:ended", cb);
export const onOffer = (cb) => socket.on("offer", cb);
export const onAnswer = (cb) => socket.on("answer", cb);
export const onIceCandidate = (cb) => socket.on("ice-candidate", cb);
