/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  brands: {},
  categories: {}
};

const brandAndCategorySlice = createSlice({
  name: 'BrandAndCategoryData',
  initialState,
  reducers: {
    setCategoryAndBrandData(state, action) {
      state.categories = action.payload.categories;
      state.brands = action.payload.brands;
    }
  }
});

export const { setCategoryAndBrandData } = brandAndCategorySlice.actions;
export default brandAndCategorySlice.reducer;
