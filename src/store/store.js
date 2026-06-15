import { configureStore } from "@reduxjs/toolkit";
import settingsReducer from "./settings/settingsSlice";
import userReducer from "./user/userSlice";
import languageReducer from "./languageSlice/languageSlice";
import modalsReducer from "./modals/modalsSlice";
import categoriesReducer from "./categories/categoriesSlice";
import instructorsReducer from "./instructors/instructorsSlice";

export const store = configureStore({
  reducer: {
    settings: settingsReducer,
    user: userReducer,
    language: languageReducer,
    modals: modalsReducer,
    categories: categoriesReducer,
    instructors: instructorsReducer,
  },
});
