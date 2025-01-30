import { createSlice } from '@reduxjs/toolkit'

const initalState = {
    currentUser: null,
    error: false,
    loading: false
};

const userSlice = createSlice({
    name: 'user',
    initialState: initalState,
    reducers: {
        signInStart: (state) => {
            state.loading = true;
        },
        signInSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        signInFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
    }
});

export const {signInStart, signInSuccess, signInFailure} = userSlice.actions;

export default userSlice.reducer;