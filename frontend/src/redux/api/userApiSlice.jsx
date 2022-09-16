import apiSlice from './apiSlice';

export const extendedUserApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getHomePage: builder.query({
      query: () => '/users/home',
      providesTags: ['user']
    })
  })
});
export const { useGetHomePageQuery } = extendedUserApiSlice;
