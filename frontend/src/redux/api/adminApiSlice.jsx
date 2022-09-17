import apiSlice from './apiSlice';

export const extendedAdminApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    adminLogin: builder.mutation({
      query: (data) => ({
        url: '/admin/login',
        method: 'POST',
        body: data
      })
    }),
    getUserData: builder.query({
      query: () => '/admin/getusers',
      providesTags: ['userdata']
    }),
    changeUserStatus: builder.mutation({
      query: (data) => ({
        url: '/admin/changeuserstatus',
        method: 'PUT',
        body: data
      }),
      invalidatesTags: ['userdata']
    }),
    getProductData: builder.query({
      query: () => '/admin/getproducts',
      providesTags: ['productdata']
    }),

    addNewProduct: builder.mutation({
      query: (data) => ({
        url: '/admin/addproduct',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['productdata']
    }),
    deleteProduct: builder.mutation({
      query: ({ id }) => ({
        url: `/admin/deleteproduct/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['productdata']
    })
  })
});

export const {
  useGetUserDataQuery,
  useAdminLoginMutation,
  useChangeUserStatusMutation,
  useGetProductDataQuery,
  useAddNewProductMutation,
  useDeleteProductMutation
} = extendedAdminApiSlice;
