import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import accountReducer from '../features/account/accountSlice';
import {api} from './api';

export const store = configureStore({
  reducer: {
    account: accountReducer,
    [api.reducerPath]: api.reducer,

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
