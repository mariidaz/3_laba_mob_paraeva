import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { searchAlbums } from '../services/itunes';

export const fetchAlbums = createAsyncThunk(
  'discover/fetchAlbums',
  async ({ term, limit = 30 }, { rejectWithValue }) => {
    try {
      return { term, albums: await searchAlbums(term, { limit }) };
    } catch (error) {
      return rejectWithValue(error.message || 'Не вдалося завантажити каталог.');
    }
  },
);

const discoverSlice = createSlice({
  name: 'discover',
  initialState: { term: '', albums: [], status: 'idle', error: null, requestId: null },
  reducers: {
    clearSearch(state) {
      state.term = '';
      state.albums = [];
      state.error = null;
      state.status = 'idle';
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchAlbums.pending, (state, action) => {
        state.status = 'loading';
        state.error = null;
        state.term = action.meta.arg.term;
        state.requestId = action.meta.requestId;
      })
      .addCase(fetchAlbums.fulfilled, (state, action) => {
        if (state.requestId !== action.meta.requestId) return;
        state.status = 'succeeded';
        state.albums = action.payload.albums;
        state.term = action.payload.term;
      })
      .addCase(fetchAlbums.rejected, (state, action) => {
        if (state.requestId !== action.meta.requestId) return;
        state.status = 'failed';
        state.error = action.payload || 'Перевір підключення до інтернету.';
      });
  },
});

export const { clearSearch } = discoverSlice.actions;
export default discoverSlice.reducer;
