import { createAsyncThunk } from "@reduxjs/toolkit";
import { getCategoriesList } from "@/api/mainServices";

export const fetchCategories = createAsyncThunk(
  "settings/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getCategoriesList();
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data.error_msg || "Failed to load categories",
      );
    }
  },
);
