
'use client'
import { msalInstance } from "@/app/redux/msalConfig";
import { setAuthState, logout, fetchUserProfile } from "./authSlice";
import {InteractionRequiredAuthError} from '@azure/msal-common'
import { useMsal } from '@azure/msal-react'
import { acquireGraphToken } from "@/app/utils/graphToken";

const convertMapToObject = (map) => {
  const obj = {};
  for (let [key, value] of map) {
    obj[key] = value;
  }
  return obj;
};


export const signIn = (instance) => async (dispatch) => {
  try {
    const loginResponse = await instance.loginPopup({
      scopes: ['User.read']
    });

    // console.log('Login response:', loginResponse);

    const tokenRequest = {
      scopes: [ 'https://api.businesscentral.dynamics.com/.default'],
      account: loginResponse.account,
    };

    let tokenResponse;
    try {
      tokenResponse = await instance.acquireTokenSilent(tokenRequest);
    } catch (silentError) {
      // console.error('Silent token acquisition failed:', silentError);
      // Fallback to acquire token interactively if silent acquisition fails
      if (silentError instanceof msal.InteractionRequiredAuthError) {
        try {
          tokenResponse = await instance.acquireTokenPopup(tokenRequest);
          // console.log('Interactive token response:', tokenResponse);
        } catch (popupError) {
          // console.error('Interactive token acquisition failed:', popupError);
          throw popupError;
        }
      } else {
        throw silentError;
      }
    }

    if (!tokenResponse || !tokenResponse.accessToken) {
      throw new Error('Failed to acquire access token');
    }

    const user = loginResponse.account;
    const accessToken = tokenResponse.accessToken;
    // console.log(accessToken)

    // Acquire a separate token for Microsoft Graph Api 

    const graphAccessToken = await acquireGraphToken(instance, loginResponse.account);
    // console.log("graph",graphAccessToken)
    // console.log('Microsoft Graph Access Token:', graphAccessToken)

     // Fetch the user profile using the Graph API access token
    //  dispatch(fetchUserProfile(graphAccessToken));

    // Convert non-serializable values to serializable
    const serializedUser = {
      ...user,
      tenantProfiles: convertMapToObject(user.tenantProfiles),
    };
    const authState = { isAuthenticated: true, user: serializedUser, accessToken, graphAccessToken };
    dispatch(setAuthState({...authState }));
    
      // Save auth state to localStorage to persist across page refreshes --new code
      localStorage.setItem('authState', JSON.stringify(authState));
  } catch (error) {
    // console.error('Login failed:', error);
  }
};

export const signOut = (instance) => async (dispatch) => {
  try {
    await instance.logoutPopup();
    dispatch(logout());

     // Clear auth state from localStorage on sign out-- new code
     localStorage.removeItem('authState');
  } catch (error) {
    //console.error('Logout failed:', error);
  }
};

// Load auth state from localStorage on app initialization --new code
export const loadAuthState = () => (dispatch) => {
  const authState = JSON.parse(localStorage.getItem('authState'));
  if (authState) {
    dispatch(setAuthState(authState));
  }
};