import { WORD_LISTS_REQUEST, WORD_LISTS_SUCCESS, WORD_LISTS_FAIL } from '@/constants/wordListsConstants';
import axios from 'axios';
import { Dispatch } from 'redux';

export const listWords = () => async ( dispatch: Dispatch ) => {
  try {
    dispatch({ type: WORD_LISTS_REQUEST });
    const { data } = await axios.get('/api/wordLists');
    dispatch({ type: WORD_LISTS_SUCCESS, payload: data });
  } catch (error: unknown) {
    const errorMessage = axios.isAxiosError(error) && error.response && error.response.data.message
        ? error.response.data.message
        : (error as Error).message;
    
    dispatch({
        type: WORD_LISTS_FAIL,
        payload: errorMessage,
    });
  }
}