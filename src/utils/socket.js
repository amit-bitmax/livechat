import { io } from "socket.io-client";

const socket = io("http://localhost:5003", {
  transports: ["websocket"],
  reconnection: true
});

export default socket;
