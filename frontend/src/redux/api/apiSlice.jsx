import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setAdminToken } from '../reducers/adminAuthSlice';
import { setToken } from '../reducers/authSlice';

let sentRefreshTokenRequest = false;

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:8000/api',
  prepareHeaders: (headers, { getState, endpoint }) => {
    const { token, refreshToken } = getState().auth.data;
    const { token: adminToken, refreshToken: adminRefreshToken } = getState().adminAuth.data;
    if (endpoint === 'refresh') {
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
  if (result?.error?.status === 401 && !sentRefreshTokenRequest) {
    console.log('sending refresh token');

    // setting refresh token sent to true
    sentRefreshTokenRequest = true;

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
      if (window.location.pathname.includes('admin')) {
        api.dispatch(setAdminToken(refreshResult.data));
      } else {
        api.dispatch(setToken(refreshResult.data));
      }
      result = await baseQuery(args, api, extraOptions);
      sentRefreshTokenRequest = false;
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
