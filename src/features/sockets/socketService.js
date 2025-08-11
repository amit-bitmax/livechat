import { io } from "socket.io-client";
import { toast } from "react-toastify";

const SERVER_URL = "http://localhost:5003";
let chatSocket = null;
let presenceSocket = null;
let notificationSocket = null;

// ✅ Initialize sockets for chat & presence
export const initSockets = (userId, role) => {
  if (!userId) return;

  if (!chatSocket) {
    chatSocket = io(`${SERVER_URL}/chat`, { query: { userId } });
    console.log("Chat socket connected");
  }

  if (!presenceSocket) {
    presenceSocket = io(`${SERVER_URL}/presence`, { query: { userId } });
    console.log("Presence socket connected");
  }

  if (!notificationSocket) {
    notificationSocket = io(SERVER_URL, { query: { role } }); // Role: Agent / QA
    console.log("Notification socket connected");

    // ✅ Listen for new petitions
    notificationSocket.on("new-petition", (data) => {
      console.log("New petition received:", data);
      toast.info(`New Petition: ${data.petitionId} - ${data.message}`);
    });
  }
};

// ✅ Get current sockets
export const getSockets = () => ({
  chatSocket,
  presenceSocket,
  notificationSocket,
});

// ✅ Disconnect sockets
export const disconnectSockets = () => {
  if (chatSocket) chatSocket.disconnect();
  if (presenceSocket) presenceSocket.disconnect();
  if (notificationSocket) notificationSocket.disconnect();

  chatSocket = null;
  presenceSocket = null;
  notificationSocket = null;
};
