import { configureStore } from '@reduxjs/toolkit';
import apiSlice from '../api/apiSlice';
import authReducer from '../reducers/authSlice';
import toastReducer from '../reducers/toastSlice';
import brandAndCategoryReducer from '../reducers/brandAndCategorySlice';
import adminAuthReducer from '../reducers/adminAuthSlice';

// setting up the global redux store
const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    adminAuth: adminAuthReducer,
    toast: toastReducer,
    brandAndCategory: brandAndCategoryReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware)
});

export default store;
