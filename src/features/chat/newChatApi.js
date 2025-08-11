import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const newChatApi = createApi({
  reducerPath: 'newChatApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5003/api/v1/newchat',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    }
  }),
  tagTypes: ['Conversation'],
  endpoints: (builder) => ({
    startConversation: builder.mutation({
      query: (body) => ({
        url: '/conversation/start',
        method: 'POST',
        body
      }),
      invalidatesTags: ['Conversation']
    }),
    sendMessage: builder.mutation({
      query: (body) => ({
        url: '/send',
        method: 'POST',
        body
      }),
      invalidatesTags: ['Conversation']
    }),
    getConversation: builder.query({
      query: (conversationId) => `/conversation/${conversationId}`,
      providesTags: ['Conversation']
    }),
    getAllCustomer: builder.query({
      query: () => '/all'
    })
  })
});

export const {
  useStartConversationMutation,
  useGetAllCustomerQuery,
  useSendMessageMutation,
  useGetConversationQuery
} = newChatApi;
