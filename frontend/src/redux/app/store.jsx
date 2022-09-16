import { configureStore } from '@reduxjs/toolkit';
import apiSlice from '../api/apiSlice';
import authReducer from '../reducers/authSlice';
import toastReducer from '../reducers/toastSlice';

// setting up the global redux store
const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    toast: toastReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware)
});

export default store;
