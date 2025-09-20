import { RootState } from "@/redux/store";
import { TAuthState } from "@/types";
import { createSlice } from "@reduxjs/toolkit";

const initialState: TAuthState = {
  user: null,
  token: null,
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setuser(state, { payload }) {
      const { user, token } = payload;
      state.token = token;
      state.user = user;
    },
    logout(state) {
      state.token = null;
      state.user = null;
    },
  },
});

export const { setuser, logout } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentToken = (state: RootState) => state.auth.token;
export const selectCurrentUser = (state: RootState) => state.auth.user;
