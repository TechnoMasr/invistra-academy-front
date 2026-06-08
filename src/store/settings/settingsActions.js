import { createAsyncThunk } from "@reduxjs/toolkit";
import { getSettings } from "../../api/mainServices";

export const fetchSettings = createAsyncThunk(
  "settings/fetchSettings",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getSettings();
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data.error_msg || "Failed to load settingss",
      );
    }
  },
);
