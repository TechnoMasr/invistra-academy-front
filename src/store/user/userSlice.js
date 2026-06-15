import { createSlice } from "@reduxjs/toolkit";
import { getUser, logoutAction } from "./userActions";

const initialState = {
  user: null,
  loading: true,
  logOutLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser: (state, action) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // log out
      .addCase(logoutAction.pending, (state) => {
        state.logOutLoading = true;
        state.error = null;
      })
      .addCase(logoutAction.fulfilled, (state) => {
        state.logOutLoading = false;
        state.user = null;
      })
      .addCase(logoutAction.rejected, (state, action) => {
        state.logOutLoading = false;
        state.error = action.payload;
      });
  },
});

export const { addUser, clearUser } = userSlice.actions;

export const selectUser = (state) => state.user.user;

export const selectUserType = (state) => state.user.user?.type;

export const selectIsStudent = (state) => state.user.user?.type === "student";

export const selectIsInstructor = (state) =>
  state.user.user?.type === "instructor";

export default userSlice.reducer;
