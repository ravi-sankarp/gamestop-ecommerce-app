import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setToken } from '../reducers/authSlice';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:8000/api',
  prepareHeaders: (headers, { getState, endpoint }) => {
    const { token, refreshToken } = getState().auth.data;
    const { token: adminToken, refreshToken: adminRefreshToken } = getState().adminAuth.data;
    if (refreshToken && endpoint === 'refresh') {
      if (window.location.href.includes('admin')) {
        headers.set('authorization', `Bearer ${adminRefreshToken}`);
      } else {
        headers.set('authorization', `Bearer ${refreshToken}`);
      }
    } else if (window.location.href.includes('admin')) {
        headers.set('authorization', `Bearer ${adminToken}`);
      } else {
        headers.set('authorization', `Bearer ${token}`);
      }
    return headers;
  }
});

const baseQueryWithReAuth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result?.error?.status === 401) {
    console.log('sending refresh token');

    // sending refresh token to get new access token
    const refreshResult = await baseQuery(
      '/auth/refreshtoken',
      { ...api, endpoint: 'refresh' },
      extraOptions
    );
    if (refreshResult?.error) {
      return refreshResult;
    }
    if (refreshResult?.data) {
      api.dispatch(setToken(refreshResult.data));
      result = await baseQuery(args, api, extraOptions);
    }
  }
  return result;
};

const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReAuth,
  tagTypes: [
    'user',
    'productdata',
    'admin',
    'userdata',
    'categorydata',
    'branddata',
    'cart',
    'wishlist',
    'userdata',
    'address',
    'orders',
    'payments',
    'offers',
    'wallet',
    'coupons',
    'banners'
  ],
  endpoints: (builder) => ({})
});

export default apiSlice;
