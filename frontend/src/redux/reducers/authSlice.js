/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: JSON.parse(localStorage.getItem('auth')) ?? {}
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken(state, action) {
      const { token, refreshToken, admin, googleAuth } = action.payload;
      localStorage.setItem(
        'auth',
        JSON.stringify({
          token,
          refreshToken,
          admin,
          googleAuth
        })
      );
      state.data = { token, refreshToken, admin, googleAuth };
    },
    deleteToken(state) {
      state.data = {};
      localStorage.removeItem('auth');
    }
  }
});

export const { setToken, deleteToken } = authSlice.actions;
export default authSlice.reducer;
