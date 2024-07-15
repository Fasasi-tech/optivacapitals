// lib/StoreProvider.js
'use client'
import React, { useEffect, useState } from 'react'

import { Provider } from 'react-redux'
import store from './store'
import { MsalProvider } from '@azure/msal-react'
import { msalInstance } from './msalConfig'
import { logout, setAuthState } from '../ui/slices/authSlice'
import { handleRedirect } from '../ui/slices/authActions'
import { jwtDecode } from 'jwt-decode' 
import { signIn } from '../ui/slices/authActions'
import { useRouter } from 'next/navigation';

// const REFRESH_THRESHOLD = 300; // 5 minutes in seconds
const REFRESH_THRESHOLD = 300; // 5 minutes in seconds
export default function StoreProvider({ children }) {
  const [intervalId, setIntervalId] = useState(null);
  const router = useRouter();

  const setRefreshTime = (accessToken) => {
    if (!accessToken) return null
    try {
      const decodedToken = jwtDecode(accessToken)
      const currentTime = Math.floor(Date.now() / 1000)
      const timeUntilExpiry = decodedToken.exp - currentTime - REFRESH_THRESHOLD
      console.log('Time until token expiry:', timeUntilExpiry)
      return timeUntilExpiry
    } catch (error) {
      // console.error('Invalid token:', error)
      return null
    }
  }


useEffect(() => {
  if (typeof window === 'undefined') return;
  const accounts = msalInstance.getAllAccounts();
  const storedAccessToken = localStorage.getItem('accessTokens');
  const graphAccessToken= localStorage.getItem('graphAccessTokens')
  
  if (accounts.length > 0 && storedAccessToken) {
    store.dispatch(setAuthState({
      isAuthenticated: true,
      user: accounts[0],
      accessToken: storedAccessToken,
      graphAccessToken
    }));
  } else {
    router.push('/'); // Redirect to login page if not authenticated
    return;
  }

  const refreshTokenCheck = () => {
    const currentToken = localStorage.getItem('accessTokens');
    const backendRefreshTime = setRefreshTime(currentToken);
    const currentGraphToken= localStorage.getItem('graphAccessTokens')
    const backendGraphRefreshTime= setRefreshTime(currentGraphToken)

    if (backendRefreshTime !== null && backendRefreshTime <= 0) {
      store.dispatch(logout())
      router.push('/')
    }

    if (backendGraphRefreshTime !== null && backendGraphRefreshTime <= 0) {
      store.dispatch(logout())
      router.push('/')
    }
  };

  const id = setInterval(refreshTokenCheck, 3000); // Check every 3 seconds
  setIntervalId(id);

  return () => clearInterval(id);
}, [router]);


  return(
    <MsalProvider instance={msalInstance}>
    <Provider store={store}>{children}</Provider>
    </MsalProvider>
  )
}