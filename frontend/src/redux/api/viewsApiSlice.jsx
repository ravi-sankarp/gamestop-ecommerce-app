import apiSlice from './apiSlice';

export const extendedViewsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getHomePage: builder.query({
      query: () => '/home',
      providesTags: ['productdata']
    }),
    getAllProducts: builder.query({
      query: () => '/getproducts',
      providesTags: ['productdata']
    }),
    getSingleProduct: builder.query({
      query: ({ id }) => `/getproduct/${id}`,
      providesTags: ['productdata']
    })
  })
});
export const { useGetHomePageQuery,
  useGetAllProductsQuery,
   useGetSingleProductQuery } = extendedViewsApiSlice;
