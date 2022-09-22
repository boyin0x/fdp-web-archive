import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { api, fdpInitializeAccount, fdpLogin } from "../../app/api";
import chromeHelper from "../../chromeHelper";
import { getStorageUserData, setStorageUserData } from "../../app/utils";

export interface AccountState {
  username: string | null;
  usernameError: string;
  passwordError: string;
  loginStatus: "idle" | "loading" | "failed" | "logout";
  initializeStatus: "idle" | "loading" | "failed" | "done";
  fdpFeedbackMessage: string
}

const initialState: AccountState = {
  username: null,
  usernameError: "",
  passwordError: "",
  loginStatus: "idle",
  initializeStatus: "idle",
  fdpFeedbackMessage: "",
};

export const checkLogin = createAsyncThunk(
  "account/checkLogin",
  async (_, { rejectWithValue, dispatch, getState }
  ) => {
    try {
      let username = await getStorageUserData("username")
      let password = await getStorageUserData("password")

      if (username && password) {
        dispatch(performLogin({ username, password }))
        dispatch(initializeAccount())
      } else {
        dispatch(logout())
      }

      return "ok";
    } catch (e) {
      return rejectWithValue((e as Error).message);
    }
  }
);

export const performLogin = createAsyncThunk(
  "account/performLogin",
  async (
    arg: { username: string; password: string },
    { dispatch, rejectWithValue }
  ) => {
    try {

      const account = await fdpLogin(arg);
      console.log({ account });

      if (account.data) {

        dispatch(api.util.invalidateTags(["PAGES"]))
        await setStorageUserData("username", arg.username)
        await setStorageUserData("password", arg.password)

        return { username: arg.username, account };
      } else {
        console.log(arg)
        throw new Error();
      }
    } catch (e) {
      return rejectWithValue((e as Error).message);
    }
  }
);

export const initializeAccount = createAsyncThunk(
  "account/initializeAccount",
  async (_, { rejectWithValue, dispatch, getState }
  ) => {
    try {
      console.log("initializeAccount");

      await fdpInitializeAccount();
      return "ok";
    } catch (e) {
      return rejectWithValue((e as Error).message);
    }
  }
);

export const logout = createAsyncThunk(
  "account/logout",
  async (_, { rejectWithValue, dispatch, getState }
  ) => {
    try {
      await setStorageUserData("localPages", "")
      await setStorageUserData("searchMetadata", "")
      await chromeHelper.storage.local.remove("username");
      await chromeHelper.storage.local.remove("password");

      return "ok";
    } catch (e) {
      return rejectWithValue((e as Error).message);
    }
  }
);

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    updateFdpFeedbackMessage: (state, action: PayloadAction<string>) => {
      state.fdpFeedbackMessage = action.payload
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(performLogin.pending, (state) => {
        state.loginStatus = "loading";
      })
      .addCase(performLogin.fulfilled, (state, action) => {
        state.loginStatus = "idle";
        state.username = action.payload.username;
      })
      .addCase(performLogin.rejected, (state, action) => {
        state.loginStatus = "failed";
        let errorMsg: string = (action.payload as string) || "Error";
        if (errorMsg && errorMsg.toLowerCase().includes("password")) {
          state.passwordError = errorMsg;
        } else if (errorMsg && errorMsg.toLowerCase().includes("user")) {
          state.usernameError = errorMsg;
        } else {
          state.usernameError = "Login error";
        }
      })

      .addCase(initializeAccount.pending, (state) => {
        state.initializeStatus = "loading";
      })
      .addCase(initializeAccount.fulfilled, (state, action) => {
        if (action.payload === "ok") {
          state.initializeStatus = "done";
        }
      })
      .addCase(initializeAccount.rejected, (state, action) => {
        state.initializeStatus = "failed";
        state.usernameError = "Error initializing app directories";
      })

      .addCase(logout.fulfilled, (state, action) => {
        if (action.payload === "ok") {
          state.usernameError = initialState.usernameError
          state.passwordError = initialState.passwordError
          state.initializeStatus = initialState.initializeStatus
          state.fdpFeedbackMessage = initialState.fdpFeedbackMessage
          state.username = null
          state.loginStatus = "logout"
        }
      })

  },
});


// Selectors

export const selectthereIsSomeQueryPending = (state: RootState) =>
  Object.values(state.api.queries).some(query => query?.status === 'pending' && query?.endpointName !== "searchPages") ||
  Object.values(state.api.mutations).some(query => query?.status === 'pending')

export const selectthereIsSomeQueryError = (state: RootState) =>
  Object.values(state.api.queries).some(query => query?.status === 'rejected' && query?.endpointName !== "searchPages") ||
  Object.values(state.api.mutations).some(query => query?.status === 'rejected')

export const { updateFdpFeedbackMessage } = accountSlice.actions;

export const selectLoggedUserName = (state: RootState) =>
  state.account.username;
export const selectUsernameError = (state: RootState) => state.account.usernameError;
export const selectPasswordError = (state: RootState) => state.account.passwordError;
export const selectLoginStatus = (state: RootState) =>
  state.account.loginStatus;

export const selectInitializeStatus = (state: RootState) => state.account.initializeStatus
export const selectAccountInitialized = (state: RootState) =>
  state.account.initializeStatus === "done";
export const selectFdpFeedbackMessage = (state: RootState) => state.account.fdpFeedbackMessage;

export default accountSlice.reducer;
