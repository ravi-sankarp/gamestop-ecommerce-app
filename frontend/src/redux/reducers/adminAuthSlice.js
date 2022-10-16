/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: JSON.parse(localStorage.getItem('adminAuth')) ?? {}
};

const adminAuthSlice = createSlice({
  name: 'adminAuth',
  initialState,
  reducers: {
    setAdminToken(state, action) {
      const { token, refreshToken, admin } = action.payload;
      localStorage.setItem(
        'adminAuth',
        JSON.stringify({
          token,
          refreshToken,
          admin
        })
      );
      state.data = { token, refreshToken, admin };
    },
    deleteAdminToken(state) {
      state.data = {};
      localStorage.removeItem('adminAuth');
    }
  }
});

export const { setAdminToken, deleteAdminToken } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;
