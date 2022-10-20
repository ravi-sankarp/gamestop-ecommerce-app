import apiSlice from './apiSlice';

export const extendedViewsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getHomePage: builder.query({
      query: () => '/home',
      providesTags: ['productdata']
    }),

    getAllProducts: builder.query({
      query: (params) => `/getallproducts${params}`,
      providesTags: ['productdata']
    }),

    getNavlist: builder.query({
      query: () => '/getnavlist',
      providesTags: ['productdata', 'categorydata', 'branddata']
    }),

    getProductAndCategories: builder.query({
      query: () => '/getproductsandcategories',
      providesTags: ['productdata', 'categorydata']
    }),

    getSingleProduct: builder.query({
      query: ({ id }) => `/getproduct/${id}`,
      providesTags: ['productdata']
    }),

    getAllBanners: builder.query({
      query: () => '/getallbanners',
      providesTags: ['banners']
    }),

    searchProduct: builder.query({
      query: (params) => `/searchproduct?search=${params.query}`,
      providesTags: ['productdata']
    }),

    getSimilarProducts: builder.query({
      query: (params) => `/findsimilarproducts?id=${params}`,
      providesTags: ['productdata']
    }),

    getProductReviews: builder.query({
      query: (params) => `/getproductreviews?id=${params}`,
      providesTags: ['reviews', 'productdata']
    })
  })
});
export const {
  useGetHomePageQuery,
  useGetAllProductsQuery,
  useGetSingleProductQuery,
  useGetNavlistQuery,
  useGetProductAndCategoriesQuery,
  useGetAllBannersQuery,
  useSearchProductQuery,
  useGetSimilarProductsQuery,
  useGetProductReviewsQuery
} = extendedViewsApiSlice;
