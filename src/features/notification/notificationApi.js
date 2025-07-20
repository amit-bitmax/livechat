import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const notificationApi = createApi({
  reducerPath: "notificationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5003/api/v1",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Notifications"],
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: ({ page = 1, limit = 10, unreadOnly = false }) => ({
        url: `/notifications`,
        params: { page, limit, unreadOnly },
      }),
      providesTags: ["Notifications"],
    }),
    markAsRead: builder.mutation({
      query: (notificationId) => ({
        url: `/notifications/${notificationId}/read`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notifications"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
} = notificationApi;
