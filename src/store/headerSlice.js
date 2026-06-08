import { createSlice } from "@reduxjs/toolkit";

const headerSlice = createSlice({
  name: "header",
  initialState: {
    productColor: null,
  },
  reducers: {
    setProductColor: (state, action) => {
      state.productColor = action.payload;
    },
    clearProductColor: (state) => {
      state.productColor = null;
    },
  },
});

export const { setProductColor, clearProductColor } = headerSlice.actions;
export default headerSlice.reducer;
