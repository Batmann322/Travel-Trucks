import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://66b1f8e71ca8ad33d4f5f63e.mockapi.io/campers";

// Async Thunks для запитів до бекенду
export const fetchCampers = createAsyncThunk(
  "campers/fetchCampers",
  async () => {
    const response = await axios.get(API_URL);
    return response.data;
  }
);

const camperSlice = createSlice({
  name: "campers",
  initialState: {
    campers: [],
    favorites: [],
    filters: {},
    status: null,
  },
  reducers: {
    toggleFavorite: (state, action) => {
      const camper = state.campers.find((c) => c.id === action.payload);
      if (camper) {
        if (state.favorites.includes(camper)) {
          state.favorites = state.favorites.filter(
            (fav) => fav.id !== camper.id
          );
        } else {
          state.favorites.push(camper);
        }
      }
    },
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCampers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCampers.fulfilled, (state, action) => {
        state.campers = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchCampers.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const { toggleFavorite, setFilters } = camperSlice.actions;
export default camperSlice.reducer;
