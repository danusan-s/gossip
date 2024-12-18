import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AccountState {
  value: string | null;
}

const initialState: AccountState = {
  value: null,
};

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setAccount: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
    unsetAccount: (state) => {
      state.value = null;
    },
  },
});

export const { setAccount, unsetAccount } = accountSlice.actions;

export default accountSlice.reducer;
