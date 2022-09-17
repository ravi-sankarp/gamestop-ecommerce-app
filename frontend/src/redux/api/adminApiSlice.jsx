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
    editProduct: builder.mutation({
      query: ({ id, data }) => ({
        url: `/admin/editproduct/${id}`,
        method: 'PUT',
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
      invalidatesTags: ['categorydata']
    }),

    editCategory: builder.mutation({
      query: ({ id, data }) => ({
        url: `/admin/editcategory/${id}`,
        method: 'PUT',
        body: data
      }),
      invalidatesTags: ['categorydata']
    }),

    deleteCategory: builder.mutation({
      query: ({ id }) => ({
        url: `/admin/deletecategory/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['categorydata']
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
      invalidatesTags: ['branddata']
    }),

    editBrand: builder.mutation({
      query: ({ id, data }) => ({
        url: `/admin/editbrand/${id}`,
        method: 'PUT',
        body: data
      }),
      invalidatesTags: ['branddata']
    }),

    deleteBrand: builder.mutation({
      query: ({ id }) => ({
        url: `/admin/deletebrand/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['branddata']
    })
  })
});

export const {
  useGetUserDataQuery,
  useAdminLoginMutation,
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
  useDeleteBrandMutation
} = extendedAdminApiSlice;
