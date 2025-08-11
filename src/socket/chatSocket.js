// chatSocket.js
import { io } from "socket.io-client";

const chatSocket = io("http://localhost:5003/chat", {
  transports: ["websocket"], 
  withCredentials: true
});

export default chatSocket;
