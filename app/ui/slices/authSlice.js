import {createSlice} from '@reduxjs/toolkit';

import Cookies from 'js-cookie';

const initialState = {
  isAuthenticated: false,
  user: typeof window !== 'undefined' && localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
  accessToken: typeof window !== 'undefined' && localStorage.getItem('accessTokens') || null,
  graphAccessToken:typeof window !== 'undefined' && localStorage.getItem('graphAccessTokens') || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthState: (state, action) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.graphAccessToken= action.payload.graphAccessToken
      if (action.payload.user) {
        state.user.tenantProfiles = Array.from(action.payload.user.tenantProfiles);
      }

       // Save to localStorage
    
       if (typeof window !== 'undefined') {
        localStorage.setItem('users', JSON.stringify(action.payload.user));
        localStorage.setItem('accessTokens', action.payload.accessToken);
      localStorage.setItem('graphAccessTokens', action.payload.graphAccessToken);}
    
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;

        if (typeof window !== 'undefined') {
        localStorage.removeItem('users');
        localStorage.removeItem('accessTokens');
        localStorage.removeItem('graphAccessTokens')
      }
    },
    // fetchUserProfile: (state, action) => {
    //     state.graphAccessToken=action.payload;
        
    //    if (typeof window !== 'undefined') {
    //     localStorage.setItem('graphAccessTokens', action.payload.graphAccessToken);
    //   }
    // }
  },
});

export const { setAuthState, logout } = authSlice.actions;
export default authSlice.reducer;