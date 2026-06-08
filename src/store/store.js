import { configureStore } from "@reduxjs/toolkit";
import settingsReducer from "./settings/settingsSlice";
import userReducer from "./user/userSlice";
import languageReducer from "./languageSlice/languageSlice";
import modalsReducer from "./modals/modalsSlice";
import headerReducer from "./headerSlice";

export const store = configureStore({
  reducer: {
    settings: settingsReducer,
    user: userReducer,
    language: languageReducer,
    modals: modalsReducer,
    header: headerReducer,
  },
});
