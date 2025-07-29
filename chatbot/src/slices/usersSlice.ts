import { createAsyncThunk, createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/store";
import Cookies from 'js-cookie';

export interface User {
  _id: string,
  sub: string;
  name: string;
  email: string;
  picture: string;
}

interface UserState {
  currentUser: User | null;
}

const storedUser = Cookies.get('googleUser');

const initialState: UserState = {
  currentUser: storedUser ? JSON.parse(storedUser) : null,
}

export const fetchUsers = createAsyncThunk("users/fetch", async (thunkAPI) => {
  const response = await fetch("http://localhost:5000/api/users", {
    method: "GET"
  });
  const data = await response.json();
  return data;
})

interface UserPayload {
  _id: string,
  sub: string;
  name: string;
  email: string;
  picture: string;
}

export const saveUser = createAsyncThunk("user/save", async ({ _id, sub, name, email, picture }: UserPayload, thunkAPI) => {
  const response = await fetch("http://localhost:5000/api/users/google-login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      _id,
      sub,
      name,
      email,
      picture
    })
  });
  const data = await response.json();
  return data;
})

export const UsersSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserFromCookie: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
    },
    clearUser: (state) => {
      state.currentUser = null;
    }
  },
  extraReducers(builder) {
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.currentUser = action.payload;
    });
  },
})

export default UsersSlice.reducer;
export const { setUserFromCookie, clearUser } = UsersSlice.actions;

export const selectCurrentUser = (state: RootState) => state.user.currentUser;
export const isLoggedInSelector = createSelector(
  [selectCurrentUser],
  (user) => !!user
);