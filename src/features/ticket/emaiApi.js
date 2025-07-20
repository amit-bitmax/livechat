import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const emailApi = createApi({
  reducerPath: 'emailApi',
 baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5003/api/v1/email', 
    prepareHeaders: (headers, { getState }) => {
      const token = localStorage.getItem('token');
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    }
  }),
  tagTypes: ['Tickets'],
  endpoints: (builder) => ({
    createCustomerTicket: builder.mutation({
      query: (body) => ({
        url: '/tickets',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Tickets'],
    }),
    agentReply: builder.mutation({
      query: ({ ticketId, message }) => ({
        url: `/tickets/${ticketId}/reply`,
        method: 'POST',
        body: { message },
      }),
      invalidatesTags: ['Tickets'],
    }),
    forwardTicket: builder.mutation({
      query: ({ ticketId, toAgentId }) => ({
        url: `/tickets/${ticketId}/forward`,
        method: 'POST',
        body: { toAgentId },
      }),
      invalidatesTags: ['Tickets'],
    }),
    getAllTickets: builder.query({
      query: () => '/',
      providesTags: ['Tickets'],
    }),
    getTicketById: builder.query({
      query: (ticketId) => `/tickets/${ticketId}`,
    }),
    getMyReplies: builder.query({
      query: () => '/tickets/replies/me',
    }),
    getAllTicketsByAssign: builder.query({
      query: () => '/tickets/assigned',
      providesTags: ['Tickets'],
    }),
    getAllTicketFilter: builder.query({
      query: ({ status, assignedTo, page = 1, limit = 10 }) => ({
        url: '/tickets/filter',
        params: { status, assignedTo, page, limit },
      }),
      providesTags: ['Tickets'],
    }),
    assignAgentToTicket: builder.mutation({
      query: ({ ticketId, agentId }) => ({
        url: `/tickets/${ticketId}/assign`,
        method: 'POST',
        body: { agentId },
      }),
      invalidatesTags: ['Tickets'],
    }),
    updateTicketStatus: builder.mutation({
      query: ({ ticketId, status }) => ({
        url: `/tickets/${ticketId}/status`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: ['Tickets'],
    }),
  }),
});

export const {
  useCreateCustomerTicketMutation,
  useAgentReplyMutation,
  useForwardTicketMutation,
  useGetAllTicketsQuery,
  useGetTicketByIdQuery,
  useGetMyRepliesQuery,
  useGetAllTicketsByAssignQuery,
  useGetAllTicketFilterQuery,
  useAssignAgentToTicketMutation,
  useUpdateTicketStatusMutation,
} = emailApi;
