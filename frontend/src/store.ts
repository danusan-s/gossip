import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./slices/theme";
import accountReducer from "./slices/account";

const store = configureStore({
  reducer: {
    theme: themeReducer,
    account: accountReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
