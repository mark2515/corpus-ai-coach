import { Action } from 'redux';
import { WORD_LISTS_REQUEST, WORD_LISTS_SUCCESS, WORD_LISTS_FAIL } from '@/constants/wordListsConstants';

interface WordListsState {
  wordLists: any[];
  loading?: boolean;
  error?: string;
}

interface WordListsAction extends Action<string> {
  payload?: {
    wordLists?: any[];
  } | string;
}

export const wordListsReducer = (state = {wordLists: []}, action: WordListsAction) => {
    switch (action.type) {
        case WORD_LISTS_REQUEST:
            return { loading: true, wordLists: [] }
        case WORD_LISTS_SUCCESS:
        return {
            loading: false,
            wordLists: (action.payload as any)?.wordLists || [],
        };
        case WORD_LISTS_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }
}