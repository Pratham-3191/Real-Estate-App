import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  currentUser: null,
  error: null,
  loading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload
      state.loading = false;
      state.error = null
    },
    signInFailure: (state, action) => {
      state.error = action.payload
      state.loading = false
    },
    userUpdateStart: (state, action) => {
      state.loading = true;
    },
    userUpdateSuccess: (state, action) => {
      state.currentUser = action.payload
      state.loading = false;
      state.error = null
    },
    userUpdateFailure: (state, action) => {
      state.error = action.payload
      state.loading = false
    },
    userDeleteStart: (state) => {
      state.loading = true;
    },
    userDeleteSuccess: (state, action) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null
    },
    userDeleteFailure: (state, action) => {
      state.error = action.payload
      state.loading = false
    },
    userSignoutStart: (state) => {
      state.loading = true;
    },
    userSignoutSuccess: (state, action) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null
    },
    userSignoutFailure: (state, action) => {
      state.error = action.payload
      state.loading = false
    },
  }
})
export const { signInStart,
  signInSuccess,
  signInFailure,
  userUpdateStart,
  userUpdateSuccess,
  userUpdateFailure,
  userDeleteStart,
  userDeleteSuccess,
  userDeleteFailure,
  userSignoutStart,
  userSignoutSuccess,
  userSignoutFailure} = userSlice.actions;

export default userSlice.reducer;
