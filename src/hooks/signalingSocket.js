import { io } from "socket.io-client";

const signalingSocket = io("http://localhost:5003", {
  transports: ["websocket"],
  reconnection: true,
});

export default signalingSocket;
