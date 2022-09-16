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
      localStorage.setItem(
        'auth',
        JSON.stringify({ token: action.payload.token, admin: action.payload.admin })
      );
      state.data = { token: action.payload.token, admin: action.payload.admin };
    },
    deleteToken(state) {
      state.data = {};
      localStorage.removeItem('auth');
    }
  }
});

export const { setToken, deleteToken } = authSlice.actions;
export default authSlice.reducer;
