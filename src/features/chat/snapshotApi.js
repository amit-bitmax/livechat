import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const snapshotApi = createApi({
  reducerPath: 'snapshotApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5003/api/v1/snapshot' }),
  endpoints: (builder) => ({
    uploadSnapshot: builder.mutation({
      query: (formData) => ({
        url: '/save-snapshot',
        method: 'POST',
        body: formData,
      }),
    }),
  }),
});

export const { useUploadSnapshotMutation } = snapshotApi;
