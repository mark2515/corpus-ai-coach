import { createAsyncThunk, createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/store";

export interface Users {
  sub: string;
  name: string;
  email: string;
  picture: string;
}

interface UsersState {
  users: Users[];
}

const initialState: UsersState = {
  users: [],
}

export const fetchUsers = createAsyncThunk("users/fetch", async (thunkAPI) => {
  const response = await fetch("http://localhost:5000/api/users", {
    method: "GET"
  });
  const data = await response.json();
  return data;
})

interface UserPayload {
  sub: string;
  name: string;
  email: string;
  picture: string;
}

export const saveUsers = createAsyncThunk("users/save", async ({ sub, name, email, picture }: UserPayload, thunkAPI) => {
  const response = await fetch("http://localhost:5000/api/users/google-login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
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
    addUsers: (state, action: PayloadAction<UserPayload>) => {
      state.users.push(action.payload);
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.users = action.payload;
    });
    builder.addCase(saveUsers.fulfilled, (state, action) => {
      state.users.push(action.payload);
    });
  },
})

export default UsersSlice.reducer;
export const { addUsers } = UsersSlice.actions;

const users = (state: RootState) => state.user.users;
export const totalUsersSelector = createSelector([users], (users) => {
  return users.length;
});