import { configureStore } from '@reduxjs/toolkit';
import dummyReducer from '@/reducers/dummyReducer';

const store = configureStore({
  reducer: { dummy: dummyReducer },
});

export default store;