import { createAsyncThunk, createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/store";
import Cookies from 'js-cookie';

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
  const response = await fetch("http://localhost:5000/api/users", {
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
  const response = await fetch("http://localhost:5000/api/users/guest-login", {
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
  const response = await fetch("http://localhost:5000/api/users/google-login", {
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
  },
})

export default UsersSlice.reducer;
export const { clearUser } = UsersSlice.actions;

export const selectCurrentUser = (state: RootState) => state.user.currentUser;