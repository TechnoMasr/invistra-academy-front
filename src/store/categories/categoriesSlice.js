import { createSlice } from "@reduxjs/toolkit";
import { fetchCategories } from "./categoriesActions";

const categoriesSlice = createSlice({
  name: "categories",
  initialState: {
    categories: [],
    categoriesLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.categoriesLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categoriesLoading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.categoriesLoading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export default categoriesSlice.reducer;
