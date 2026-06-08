import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  modalName: null,
  modalData: null,
};

const modalsSlice = createSlice({
  name: "modals",
  initialState,
  reducers: {
    openModal: (state, action) => {
      state.modalName = action.payload.modalName;
      state.modalData = action.payload.modalData || null;
    },

    closeModal: (state) => {
      state.modalName = null;
      state.modalData = null;
    },
  },
});

export const { openModal, closeModal } = modalsSlice.actions;
export default modalsSlice.reducer;
