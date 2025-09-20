import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/store";
import { API_BASE } from "@/utils/constant";

export interface User {
  _id: string;
  name: string;
  email: string;
  picture: string;
  isGuest: boolean;
}

interface UserState {
  currentUser: User | null;
}

const initialState: UserState = {
  currentUser: null,
};

interface UserPayload {
  _id: string;
  name: string;
  email: string;
  picture: string;
}

export const saveGuestUser = createAsyncThunk(
  "guestUser/save",
  async ({ _id, name, email, picture }: UserPayload, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/users/guest-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          _id,
          name,
          email,
          picture,
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { ...data, isGuest: true };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to save guest user');
    }
  }
);

export const saveGoogleUser = createAsyncThunk(
  "googleUser/save",
  async ({ _id, name, email, picture }: UserPayload, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/users/google-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          _id,
          name,
          email,
          picture,
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to save Google user');
    }
  }
);

export const UsersSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUser: (state) => {
      state.currentUser = null;
    },
    setUser: (state, action) => {
      state.currentUser = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveGuestUser.fulfilled, (state, action) => {
        state.currentUser = action.payload;
      })
      .addCase(saveGuestUser.rejected, (state, action) => {
        console.error("Failed to save guest user:", action.payload);
      })
      .addCase(saveGoogleUser.fulfilled, (state, action) => {
        state.currentUser = action.payload;
      })
      .addCase(saveGoogleUser.rejected, (state, action) => {
        console.error("Failed to save Google user:", action.payload);
      });
  },
});

export default UsersSlice.reducer;
export const { clearUser, setUser } = UsersSlice.actions;
export const selectCurrentUser = (state: RootState) => state.user.currentUser;