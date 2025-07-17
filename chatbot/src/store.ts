import { configureStore } from '@reduxjs/toolkit';
import { WordListsSlice } from './slices/wordListsSlice';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

const store = configureStore({
  reducer: { wordList: WordListsSlice.reducer },
});

export default store;
export const useAppDispatch: ()=> typeof store.dispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<ReturnType<typeof store.getState>> = useSelector;