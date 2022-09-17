/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: { open: false, data: {} }
};

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    setToast(state, action) {
      state.data = { open: action.payload.open, data: action.payload.data };
    },
    clearToast(state) {
      state.data = {};
    }
  }
});

export const { setToast, clearToast } = toastSlice.actions;
export default toastSlice.reducer;
