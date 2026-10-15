import { configureStore } from '@reduxjs/toolkit';
import discoverReducer from './discoverSlice';
import libraryReducer from './librarySlice';

export const store = configureStore({
  reducer: { discover: discoverReducer, library: libraryReducer },
});
