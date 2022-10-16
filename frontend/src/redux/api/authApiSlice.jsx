import apiSlice from './apiSlice';

export const extendedUserApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    userLogin: builder.mutation({
      query: (data) => ({
        url: '/auth/login',
        method: 'POST',
        body: data
      })
    }),

    adminLogin: builder.mutation({
      query: (data) => ({
        url: '/auth/adminlogin',
        method: 'POST',
        body: data
      })
    }),

    userRequestOtp: builder.mutation({
      query: (data) => ({
        url: '/auth/requestotp',
        method: 'POST',
        body: data
      })
    }),

    userVerifyOtp: builder.mutation({
      query: (data) => ({
        url: '/auth/verifyotp',
        method: 'POST',
        body: data
      })
    }),

    userRegister: builder.mutation({
      query: (data) => ({
        url: '/auth/register',
        method: 'POST',
        body: data
      })
    }),

    userForgotPassword: builder.mutation({
      query: (data) => ({
        url: '/auth/forgotpassword',
        method: 'POST',
        body: data
      })
    }),

    userChangePassword: builder.mutation({
      query: (data) => ({
        url: '/auth/changepassword',
        method: 'POST',
        body: data
      })
    })
  })
});
export const {
  useUserLoginMutation,
  useAdminLoginMutation,
  useUserRegisterMutation,
  useUserRequestOtpMutation,
  useUserVerifyOtpMutation,
  useUserForgotPasswordMutation,
  useUserChangePasswordMutation
} = extendedUserApiSlice;
