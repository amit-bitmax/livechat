import React, { useEffect } from 'react';
import { io } from 'socket.io-client';

const Dashboard = () => {
  useEffect(() => {
    const socket = io('http://localhost:5173', {
      withCredentials: true
    });

    socket.on('connect', () => {
      console.log('Connected:', socket.id);
      const userId = localStorage.getItem('userId');
      socket.emit('user-joined', { userId });
    });

    socket.on('disconnect', () => {
      console.log('Disconnected');
    });

    return () => socket.disconnect();
  }, []);

  return <h1>Dashboard</h1>;
};

export default Dashboard;
