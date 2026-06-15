import { createSlice } from "@reduxjs/toolkit";
import { fetchInstructors } from "./instructorsActions";

const instructorsSlice = createSlice({
  name: "instructors",
  initialState: {
    instructors: [],
    instructorsLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInstructors.pending, (state) => {
        state.instructorsLoading = true;
        state.error = null;
      })
      .addCase(fetchInstructors.fulfilled, (state, action) => {
        state.instructorsLoading = false;
        state.instructors = action.payload;
      })
      .addCase(fetchInstructors.rejected, (state, action) => {
        state.instructorsLoading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export default instructorsSlice.reducer;
