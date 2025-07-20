import { configureStore } from '@reduxjs/toolkit';
import { WordListsSlice } from './slices/wordListsSlice';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

const store = configureStore({
  reducer: { wordList: WordListsSlice.reducer },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export const useAppDispatch: ()=> typeof store.dispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;