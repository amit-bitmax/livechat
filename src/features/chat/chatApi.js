import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5003/api/v1/chatmessage" }),
  tagTypes: ["Chat"],
  endpoints: (builder) => ({
    getMessages: builder.query({
      query: () => "/messages",
      providesTags: ["Chat"],
    }),
    sendMessage: builder.mutation({
      query: (body) => ({
        url: "/send",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Chat"],
    }),
  }),
});

export const { useGetMessagesQuery, useSendMessageMutation } = chatApi;
