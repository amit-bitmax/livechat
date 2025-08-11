// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import { authApi } from '../features/auth/authApi';
import { ticketApi } from '../features/ticket/ticketApi';
import { chatApi } from '../features/chat/chatApi';
import { notificationApi } from '../features/notification/notificationApi';
import { snapshotApi } from '../features/chat/snapshotApi';
import { customerApi } from '../features/customer/customerApi';
import { newChatApi } from '../features/chat/newChatApi';
import { roomApi } from '../features/room/roomApi';

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [ticketApi.reducerPath]: ticketApi.reducer,
    [chatApi.reducerPath]: chatApi.reducer,
    [notificationApi.reducerPath]:chatApi.reducer,
    [snapshotApi.reducerPath]: snapshotApi.reducer,
    [customerApi.reducerPath]:customerApi.reducer,
    [newChatApi.reducerPath]: newChatApi.reducer,
    [roomApi.reducerPath]: roomApi.reducer,
 
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware)
  .concat(ticketApi.middleware)
  .concat(chatApi.middleware)
  .concat(notificationApi.middleware)
  .concat(snapshotApi.middleware)
  .concat(customerApi.middleware)
  .concat(newChatApi.middleware)
  .concat(roomApi.middleware),
});
