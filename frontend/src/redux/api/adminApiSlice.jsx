import apiSlice from './apiSlice';

export const extendedAdminApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
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
      providesTags: ['productdata', 'categorydata', 'branddata']
    }),

    addNewProduct: builder.mutation({
      query: (data) => ({
        url: '/admin/addproduct',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['productdata', 'categorydata', 'branddata']
    }),
    editProduct: builder.mutation({
      query: ({ id, data }) => ({
        url: `/admin/editproduct/${id}`,
        method: 'PUT',
        body: data
      }),
      invalidatesTags: ['productdata', 'categorydata', 'branddata']
    }),
    deleteProduct: builder.mutation({
      query: ({ id }) => ({
        url: `/admin/deleteproduct/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['productdata', 'categorydata', 'branddata']
    }),

    getCategoryData: builder.query({
      query: () => '/admin/getcategories',
      providesTags: ['categorydata']
    }),

    addNewCategory: builder.mutation({
      query: (data) => ({
        url: '/admin/addcategory',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['categorydata', 'productdata']
    }),

    editCategory: builder.mutation({
      query: ({ id, data }) => ({
        url: `/admin/editcategory/${id}`,
        method: 'PUT',
        body: data
      }),
      invalidatesTags: ['categorydata', 'productdata']
    }),

    deleteCategory: builder.mutation({
      query: ({ id }) => ({
        url: `/admin/deletecategory/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['categorydata', 'productdata']
    }),

    getBrandData: builder.query({
      query: () => '/admin/getbrands',
      providesTags: ['branddata']
    }),

    addNewBrand: builder.mutation({
      query: (data) => ({
        url: '/admin/addbrand',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['branddata', 'productdata']
    }),

    editBrand: builder.mutation({
      query: ({ id, data }) => ({
        url: `/admin/editbrand/${id}`,
        method: 'PUT',
        body: data
      }),
      invalidatesTags: ['branddata', 'productdata']
    }),

    deleteBrand: builder.mutation({
      query: ({ id }) => ({
        url: `/admin/deletebrand/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['branddata', 'productdata']
    }),

    getAllOrders: builder.query({
      query: () => '/admin/getallorders',
      providesTags: ['orders']
    }),

    changeOrderStatus: builder.mutation({
      query: (data) => ({
        url: '/admin/changeorderstatus',
        method: 'PATCH',
        body: data
      }),
      invalidatesTags: ['orders', 'productdata']
    }),

    getDashboardCardData: builder.query({
      query: () => '/admin/getdashboardcarddata',
      providesTags: ['orders', 'productdata']
    }),

    getDashboardGraphData: builder.query({
      query: () => '/admin/getdashboardgraphdata',
      providesTags: ['orders', 'productdata']
    })
  })
});

export const {
  useGetUserDataQuery,
  useChangeUserStatusMutation,
  useGetProductDataQuery,
  useAddNewProductMutation,
  useDeleteProductMutation,
  useEditProductMutation,
  useGetCategoryDataQuery,
  useAddNewCategoryMutation,
  useEditCategoryMutation,
  useDeleteCategoryMutation,
  useGetBrandDataQuery,
  useAddNewBrandMutation,
  useEditBrandMutation,
  useDeleteBrandMutation,
  useGetAllOrdersQuery,
  useChangeOrderStatusMutation,
  useGetDashboardCardDataQuery,
  useGetDashboardGraphDataQuery
} = extendedAdminApiSlice;
