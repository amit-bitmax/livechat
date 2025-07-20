// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import { authApi } from '../features/auth/authApi';
import { ticketApi } from '../features/ticket/ticketApi';
import { chatApi } from '../features/chat/chatApi';
import { notificationApi } from '../features/notification/notificationApi';

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [ticketApi.reducerPath]: ticketApi.reducer,
    [chatApi.reducerPath]: chatApi.reducer,
    [notificationApi.reducerPath]:chatApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware)
  .concat(ticketApi.middleware)
  .concat(chatApi.middleware)
  .concat(notificationApi.middleware),
});
