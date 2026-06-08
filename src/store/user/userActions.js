import { createAsyncThunk } from "@reduxjs/toolkit";
import { getProfile, logoutUser } from "../../api/authServices";

export const getUser = createAsyncThunk(
  "user/getUser",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getProfile();

      return data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to load user",
      );
    }
  },
);

export const logoutAction = createAsyncThunk(
  "user/logoutAction",
  async (_, { rejectWithValue }) => {
    try {
      const data = await logoutUser();

      return data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to load user",
      );
    }
  },
);
