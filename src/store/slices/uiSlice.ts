import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

type Theme = 'light' | 'dark';

const getInitialTheme = (): Theme => {
  const saved = localStorage.getItem('theme') as Theme | null;
  return saved || 'light';
};

interface UiState {
  sidebarOpen: boolean;
  theme: Theme;
}

const initialState: UiState = {
  sidebarOpen: false,
  theme: getInitialTheme(),
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
      localStorage.setItem('theme', action.payload);
    },
  },
});

export const { toggleSidebar, setTheme } = uiSlice.actions;
export default uiSlice.reducer;