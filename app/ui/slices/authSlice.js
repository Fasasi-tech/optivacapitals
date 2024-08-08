// import { createSlice } from '@reduxjs/toolkit';

// const getInitialState = () => {
//   if (typeof window !== 'undefined') {
//     const userFromStorage = localStorage.getItem('users') ? JSON.parse(localStorage.getItem('users')) : null;
//     const accessTokenFromStorage = localStorage.getItem('accessTokens') || null;
//     const graphAccessTokenFromStorage = localStorage.getItem('graphAccessTokens') || null;

//     return {
//       isAuthenticated: userFromStorage && (accessTokenFromStorage || graphAccessTokenFromStorage) ? true : false,
//       user: userFromStorage,
//       accessToken: accessTokenFromStorage,
//       graphAccessToken: graphAccessTokenFromStorage,
//     };
//   } else {
//     return {
//       isAuthenticated: false,
//       user: null,
//       accessToken: null,
//       graphAccessToken: null,
//     };
//   }
// };

// const initialState = getInitialState();
// const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
//     setAuthState: (state, action) => {
//       state.isAuthenticated = action.payload.isAuthenticated;
//       state.user = action.payload.user;
//       state.accessToken = action.payload.accessToken;
//       state.graphAccessToken= action.payload.graphAccessToken
//       if (action.payload.user) {
//         state.user.tenantProfiles = Array.from(action.payload.user.tenantProfiles);
//       }

//        // Save to localStorage
    
//        if (typeof window !== 'undefined') {
//         localStorage.setItem('users', JSON.stringify(action.payload.user));
//         localStorage.setItem('accessTokens', action.payload.accessToken);
//       localStorage.setItem('graphAccessTokens', action.payload.graphAccessToken);}
    
//     },
//     logout: (state) => {
//       state.isAuthenticated = false;
//       state.user = null;
//       state.accessToken = null;
//       state.graphAccessToken = null;

//         if (typeof window !== 'undefined') {
//         localStorage.removeItem('users');
//         localStorage.removeItem('accessTokens');
//         localStorage.removeItem('graphAccessTokens')
//       }
//     },
  
//   },
// });

// export const { setAuthState, logout } = authSlice.actions;
// export default authSlice.reducer;


import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

const getInitialState = () => {
  const userFromCookie = Cookies.get('users') ? JSON.parse(Cookies.get('users')) : null;
  const accessTokenFromCookie = Cookies.get('accessTokens') || null;
  const graphAccessTokenFromCookie = Cookies.get('graphAccessTokens') || null;

  return {
    isAuthenticated: userFromCookie && (accessTokenFromCookie || graphAccessTokenFromCookie) ? true : false,
    user: userFromCookie,
    accessToken: accessTokenFromCookie,
    graphAccessToken: graphAccessTokenFromCookie,
  };
};

const initialState = getInitialState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthState: (state, action) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.graphAccessToken = action.payload.graphAccessToken;
      if (action.payload.user) {
        state.user.tenantProfiles = Array.from(action.payload.user.tenantProfiles);
      }

      // Save to Cookies
      Cookies.set('users', JSON.stringify(action.payload.user));
      Cookies.set('accessTokens', action.payload.accessToken);
      Cookies.set('graphAccessTokens', action.payload.graphAccessToken);
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;
      state.graphAccessToken = null;

      // Remove Cookies
      Cookies.remove('users');
      Cookies.remove('accessTokens');
      Cookies.remove('graphAccessTokens');
    },
  },
});

export const { setAuthState, logout } = authSlice.actions;
export default authSlice.reducer;
