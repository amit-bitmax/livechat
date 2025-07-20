import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5003', {
  withCredentials: true,
});

const SocketChat = ({ currentUserId }) => {
  const [message, setMessage] = useState('');
  const [toUserId, setToUserId] = useState('');
  const [chat, setChat] = useState([]);

  useEffect(() => {
    // Send current user ID when socket connects
    socket.on('connect', () => {
      console.log('🟢 Connected to server:', socket.id);
      socket.emit('user-joined', { userId: currentUserId });
    });

    // Handle private message receive
    socket.on('receive-private-message', (data) => {
      console.log('📨 Message received:', data);
      setChat((prev) => [...prev, { from: data.from, message: data.message }]);
    });

    // Clean up on unmount
    return () => {
      socket.disconnect();
    };
  }, [currentUserId]);

  const handleSendMessage = () => {
    if (!toUserId || !message) return;
    socket.emit('send-private-message', {
      toUserId,
      message,
    });
    setChat((prev) => [...prev, { from: 'You', message }]);
    setMessage('');
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🔐 Private Chat</h2>
      <div>
        <label>To User ID: </label>
        <input
          type="text"
          value={toUserId}
          onChange={(e) => setToUserId(e.target.value)}
          placeholder="Enter target user ID"
        />
      </div>
      <div>
        <label>Message: </label>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
      <hr />
      <h3>💬 Chat Log:</h3>
      <ul>
        {chat.map((msg, idx) => (
          <li key={idx}>
            <strong>{msg.from}:</strong> {msg.message}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SocketChat;
