import apiSlice from './apiSlice';

export const extendedAdminApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserData: builder.query({
      query: () => '/admin/getusers',
      providesTags: ['userdata']
    }),
    adminLogin: builder.mutation({
      query: (data) => ({
        url: '/admin/login',
        method: 'POST',
        body: data
      })
    }),
    changeuserstatus: builder.mutation({
      query: (data) => ({
        url: '/admin/changeuserstatus',
        method: 'PUT',
        body: data
      }),
      invalidatesTags: ['userdata']
    })
  })
});

export const { useGetUserDataQuery, useAdminLoginMutation,
   useChangeuserstatusMutation } = extendedAdminApiSlice;
