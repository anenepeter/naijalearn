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
    // Define your authentication reducers here
    // For now, just a placeholder
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setLoading } = authSlice.actions;

export default authSlice.reducer;