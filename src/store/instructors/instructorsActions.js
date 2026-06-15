import { createAsyncThunk } from "@reduxjs/toolkit";
import { getInstructorsList } from "@/api/mainServices";

export const fetchInstructors = createAsyncThunk(
  "settings/fetchInstructors",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getInstructorsList();
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data.error_msg || "Failed to load instructors",
      );
    }
  },
);
