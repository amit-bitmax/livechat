import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:5003/api/v1',
  prepareHeaders: (headers, { getState }) => {
    // Always set Content-Type
    headers.set('Content-Type', 'application/json');

    // Set Authorization if token exists
    const token = getState()?.auth?.token;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  },
});

export default baseQuery;
