import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface WordLists {
  rank: string;
  word: string;
}

interface WordListsState {
    wordLists: WordLists[];
}

const initialState: WordListsState = {
    wordLists: [],
}

export const WordListsSlice = createSlice({
  name: "wordList",
  initialState,
  reducers: {
    addWordLists: (state, action: PayloadAction<WordLists>) => {
      state.wordLists.push(action.payload);
    },
  },
})

export default WordListsSlice.reducer;
export const { addWordLists } = WordListsSlice.actions;