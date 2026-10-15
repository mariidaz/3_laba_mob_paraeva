import { createSlice } from '@reduxjs/toolkit';

const initialState = { savedAlbums: [], notes: {}, hydrated: false };

const librarySlice = createSlice({
  name: 'library',
  initialState,
  reducers: {
    restoreLibrary(state, action) {
      state.savedAlbums = Array.isArray(action.payload?.savedAlbums) ? action.payload.savedAlbums : [];
      state.notes = action.payload?.notes && typeof action.payload.notes === 'object' ? action.payload.notes : {};
      state.hydrated = true;
    },
    toggleSavedAlbum(state, action) {
      const album = action.payload;
      const exists = state.savedAlbums.some((item) => item.id === album.id);
      state.savedAlbums = exists
        ? state.savedAlbums.filter((item) => item.id !== album.id)
        : [album, ...state.savedAlbums];
    },
    saveNote(state, action) {
      const { album, text, rating, mood } = action.payload;
      if (!text.trim()) {
        delete state.notes[album.id];
        return;
      }
      state.notes[album.id] = { album, text: text.trim(), rating, mood, updatedAt: new Date().toISOString() };
      if (!state.savedAlbums.some((item) => item.id === album.id)) state.savedAlbums.unshift(album);
    },
    removeNote(state, action) { delete state.notes[action.payload]; },
  },
});

export const { restoreLibrary, toggleSavedAlbum, saveNote, removeNote } = librarySlice.actions;
export default librarySlice.reducer;
