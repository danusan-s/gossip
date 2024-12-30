import { createSlice } from "@reduxjs/toolkit";

export interface ThemeState {
  value: boolean;
}

export const themeSlice = createSlice({
  name: "theme",
  initialState: {
    value: window.matchMedia("(prefers-color-scheme: dark)").matches
      ? true
      : false,
  },
  reducers: {
    toggleDarkTheme: (state) => {
      state.value = !state.value;
    },
    setDarkTheme: (state) => {
      state.value = true;
    },
    setLightTheme: (state) => {
      state.value = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const { toggleDarkTheme, setDarkTheme, setLightTheme } =
  themeSlice.actions;

export default themeSlice.reducer;
