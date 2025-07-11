import { UnknownAction } from 'redux';

export default (state = {}, action: UnknownAction) => {
  switch (action.type) {
    default:
      return state;
  }
}