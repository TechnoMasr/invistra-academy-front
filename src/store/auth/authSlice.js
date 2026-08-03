import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
  user: null, // بيانات اليوزر
  token: null, // الـ access token
  isAuthenticated: false,
  isEmailVerified: false,
  isInitialized: false, // هل اتعملت fetchUser لأول مرة؟
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;

      // تحديث اليوزر فقط لو مبعوث في الـ payload
      if (user) {
        state.user = user;
        state.isEmailVerified = user?.is_verified ?? false;
      }

      // تحديث التوكن فقط لو مبعوث (عشان ما يمسحش التوكن القديم عند تحديث البروفايل)
      if (token) {
        state.token = token;
      }

      state.isAuthenticated = true;
      state.isInitialized = true;
    },
    setInitialized: (state) => {
      state.isInitialized = true;
    },
    logout: (state) => {
      Cookies.remove("token");
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isEmailVerified = false;
    },
  },
});

export const { setCredentials, setInitialized, logout } = authSlice.actions;
export default authSlice.reducer;
