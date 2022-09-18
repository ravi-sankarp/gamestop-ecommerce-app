import apiSlice from './apiSlice';

export const extendedUserApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    userLogin: builder.mutation({
      query: (data) => ({
        url: '/login',
        method: 'POST',
        body: data
      })
    }),
    userRequestOtp: builder.mutation({
      query: (data) => ({
        url: '/requestotp',
        method: 'POST',
        body: data
      })
    }),
    userVerifyOtp: builder.mutation({
      query: (data) => ({
        url: '/verifyotp',
        method: 'POST',
        body: data
      })
    }),
    userRegister: builder.mutation({
      query: (data) => ({
        url: '/register',
        method: 'POST',
        body: data
      })
    })
  })
});
export const {
  useUserLoginMutation,
  useUserRegisterMutation,
  useUserRequestOtpMutation,
  useUserVerifyOtpMutation
} = extendedUserApiSlice;
