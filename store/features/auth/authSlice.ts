import { createSlice } from '@reduxjs/toolkit';

interface AuthState {
  user: any | null; // Replace 'any' with your user type later
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthUser: (state, action) => {
      state.user = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    clearAuthUser: (state) => {
      state.user = null;
      state.isLoading = false;
      state.error = null;
    },
    setAuthLoading: (state, action) => {
      state.isLoading = action.payload;
      state.error = null; // Clear error when loading starts
    },
    setAuthError: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.user = null; // Clear user on error
    },
  },
});

export const { setAuthUser, clearAuthUser, setAuthLoading, setAuthError } = authSlice.actions;

export default authSlice.reducer;