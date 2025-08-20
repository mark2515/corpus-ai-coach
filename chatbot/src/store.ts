import { configureStore } from '@reduxjs/toolkit';
import { UsersSlice } from './slices/usersSlice';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

const store = configureStore({
  reducer: {
    user: UsersSlice.reducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export const useAppDispatch: ()=> typeof store.dispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;