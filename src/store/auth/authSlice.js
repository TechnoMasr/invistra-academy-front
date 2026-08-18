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

      // تحديث اليوزر: merge مع البيانات القديمة بدل استبدال كامل
      // عشان لو تحديث جديد جالك ناقص (مثلاً مبعتش category)، ميمسحش القديم
      if (user) {
        state.user = state.user ? { ...state.user, ...user } : user;
        state.isEmailVerified = user?.is_verified ?? state.isEmailVerified;
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
