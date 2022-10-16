/* eslint-disable no-return-await */
import apiSlice from './apiSlice';

export const extendedUserApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCartDetails: builder.query({
      query: () => '/user/getcartdetails',
      providesTags: ['cart']
    }),

    getCartAndWishlistCount: builder.query({
      query: () => '/user/getcartandwishlistcount',
      providesTags: ['cart', 'wishlist']
    }),

    getCartTotal: builder.query({
      query: () => '/user/getcarttotal',
      providesTags: ['']
    }),

    updateCart: builder.mutation({
      query: (data) => ({
        url: '/user/updatecart',
        method: 'PUT',
        body: data
      }),
      invalidatesTags: ['cart']
    }),

    removeFromCart: builder.mutation({
      query: ({ id }) => ({
        url: `/user/removefromcart/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['cart']
    }),

    getWishlistDetails: builder.query({
      query: () => '/user/getwishlistdetails',
      providesTags: ['wishlist']
    }),

    updateWishlist: builder.mutation({
      query: (data) => ({
        url: '/user/updatewishlist',
        method: 'PUT',
        body: data
      }),
      invalidatesTags: ['wishlist']
    }),

    removeFromWishlist: builder.mutation({
      query: ({ id }) => ({
        url: `/user/removefromwishlist/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['wishlist']
    }),

    moveToWishlist: builder.mutation({
      query: ({ id }) => ({
        url: `/user/movetowishlist/${id}`,
        method: 'PUT'
      }),
      invalidatesTags: ['wishlist', 'cart']
    }),

    moveToCart: builder.mutation({
      query: ({ id }) => ({
        url: `/user/movetocart/${id}`,
        method: 'PUT'
      }),
      invalidatesTags: ['wishlist', 'cart']
    }),

    getAddresses: builder.query({
      query: () => '/user/getaddresses',
      providesTags: ['address']
    }),

    getUseWalletDetails: builder.query({
      query: () => '/user/getwalletdetails',
      providesTags: ['wallet']
    }),

    getWalletBalance: builder.query({
      query: () => '/user/getwalletbalance',
      providesTags: ['wallet']
    }),

    addToWallet: builder.mutation({
      query: (data) => ({
        url: '/user/addtowallet',
        method: 'POST',
        body: data
      })
    }),

    getUserDetails: builder.query({
      query: () => '/user/getuserdetails',
      providesTags: ['userdata']
    }),

    editUserDetails: builder.mutation({
      query: (data) => ({
        url: '/user/edituserdetails',
        method: 'PUT',
        body: data
      }),
      invalidatesTags: ['userdata']
    }),

    changeUserPassword: builder.mutation({
      query: (data) => ({
        url: '/user/changeuserpassword',
        method: 'PUT',
        body: data
      }),
      invalidatesTags: ['userdata']
    }),

    addAddress: builder.mutation({
      query: (data) => ({
        url: '/user/addaddress',
        method: 'PUT',
        body: data
      }),
      invalidatesTags: ['address']
    }),

    editAddress: builder.mutation({
      query: ({ id, data }) => ({
        url: `/user/editaddress/${id}`,
        method: 'PUT',
        body: data
      }),
      invalidatesTags: ['address']
    }),

    deleteAddress: builder.mutation({
      query: ({ id }) => ({
        url: `/user/deleteaddress/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['address']
    }),

    checkCoupon: builder.mutation({
      query: (data) => ({
        url: '/user/checkcoupon',
        method: 'POST',
        body: data
      })
    }),

    purchaseWithCod: builder.mutation({
      query: (data) => ({
        url: '/user/purchasewithcod',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['orders', 'cart', 'productdata']
    }),

    purchaseWithWallet: builder.mutation({
      query: (data) => ({
        url: '/user/purchasewithwallet',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['orders', 'cart', 'productdata']
    }),

    createRazorpayOrder: builder.mutation({
      query: (data) => ({
        url: '/user/createrazorpayorder',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['orders']
    }),

    checkPaymentStatus: builder.query({
      query: ({ id }) => `/user/checkpaymentstatus/${id}`,
      keepUnusedDataFor: 0,
      invalidatesTags: ['orders', 'cart', 'productdata', 'wallet']
    }),

    createPaypalOrder: builder.mutation({
      query: (data) => ({
        url: '/user/createpaypalorder',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['orders']
    }),

    verifyPaypal: builder.mutation({
      query: (data) => ({
        url: '/user/verifypaypal',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['orders', 'cart', 'productdata']
    }),

    getUserOrders: builder.query({
      query: () => '/user/getallorders',
      providesTags: ['orders'],
      invalidatesTags: ['orders', 'cart', 'productdata']
    }),

    cancelOrder: builder.mutation({
      query: (data) => ({
        url: '/user/cancelorder',
        method: 'PATCH',
        body: data
      }),
      invalidatesTags: ['orders', 'wallet']
    }),

    returnOrder: builder.mutation({
      query: (data) => ({
        url: '/user/returnproduct',
        method: 'PATCH',
        body: data
      }),
      invalidatesTags: ['orders', 'wallet']
    }),

    getInvoice: builder.query({
      query: ({ id }) => ({
        url: `/user/getinvoice/${id}`,
        responseHandler: async (response) => {
          const data = await response.blob();
          const hiddenElement = document.createElement('a');
          const url = window.URL || window.webkitURL;
          const blobPDF = url.createObjectURL(new Blob([data]));
          hiddenElement.href = blobPDF;
          hiddenElement.target = '_blank';
          hiddenElement.download = 'invoice.pdf';
          hiddenElement.click();
          return { data: null };
        }
      }),
      keepUnusedDataFor: 0
    })
  }),
  overrideExisting: false
});

export const {
  useGetCartDetailsQuery,
  useGetCartAndWishlistCountQuery,
  useGetCartTotalQuery,
  useUpdateCartMutation,
  useRemoveFromCartMutation,
  useGetWishlistDetailsQuery,
  useUpdateWishlistMutation,
  useRemoveFromWishlistMutation,
  useMoveToCartMutation,
  useMoveToWishlistMutation,
  useGetUserDetailsQuery,
  useEditUserDetailsMutation,
  useChangeUserPasswordMutation,
  useGetAddressesQuery,
  useAddAddressMutation,
  useEditAddressMutation,
  useDeleteAddressMutation,
  usePurchaseWithCodMutation,
  useCreateRazorpayOrderMutation,
  useCheckPaymentStatusQuery,
  useCreatePaypalOrderMutation,
  useVerifyPaypalMutation,
  useGetUserOrdersQuery,
  useCancelOrderMutation,
  useReturnOrderMutation,
  useGetInvoiceQuery,
  useCheckCouponMutation,
  useGetUseWalletDetailsQuery,
  useGetWalletBalanceQuery,
  useAddToWalletMutation,
  usePurchaseWithWalletMutation
} = extendedUserApiSlice;
