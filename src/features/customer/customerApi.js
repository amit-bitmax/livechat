// src/features/auth/customerApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const customerApi = createApi({
  reducerPath: 'customerApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5003/api/v1/customer',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getAllCustomer: builder.query({
      query: () => '',
    }),
    getSingleCustomer: builder.query({
      query: (id) => `/${id}`,
    }),
  }),
});

// Export hooks
export const {
  useGetAllCustomerQuery,
  useGetSingleCustomerQuery,
} = customerApi;
