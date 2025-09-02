import { createAsyncThunk, createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/store";
import Cookies from 'js-cookie';
import { API_BASE } from "@/utils/constant";

export interface User {
  _id: string,
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
}

export const fetchUsers = createAsyncThunk("users/fetch", async () => {
  const response = await fetch(`${API_BASE}/users`, {
    method: "GET"
  });
  const data = await response.json();
  return data;
})

interface UserPayload {
  _id: string,
  name: string;
  email: string;
  picture: string;
}

export const saveGuestUser = createAsyncThunk("guestUser/save", async ({ _id, name, email, picture }: UserPayload) => {
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
  const data = await response.json();
  return data;
})

export const saveGoogleUser = createAsyncThunk("googleUser/save", async ({ _id, name, email, picture }: UserPayload) => {
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
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  
  const data = await response.json();
  return data;
})

export const UsersSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUser: (state) => {
      state.currentUser = null;
    }
  },
  extraReducers(builder) {
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.currentUser = action.payload[0] || null;
    });
    builder.addCase(saveGuestUser.fulfilled, (state, action) => {
      state.currentUser = action.payload;
    });
    builder.addCase(saveGoogleUser.fulfilled, (state, action) => {
      state.currentUser = action.payload;
    });

    builder.addCase(saveGoogleUser.rejected, (state, action) => {
      console.error("Failed to save Google user:", action.error.message);
    });
    builder.addCase(saveGuestUser.rejected, (state, action) => {
      console.error("Failed to save guest user:", action.error.message);
    });
  },
})

export default UsersSlice.reducer;
export const { clearUser } = UsersSlice.actions;

export const selectCurrentUser = (state: RootState) => state.user.currentUser;