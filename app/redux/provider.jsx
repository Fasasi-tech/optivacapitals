// // lib/StoreProvider.js
// 'use client'
// import React, { useEffect, useState } from 'react'

// import { Provider } from 'react-redux'
// import store from './store'
// import { MsalProvider } from '@azure/msal-react'
// import { msalInstance } from './msalConfig'
// import { logout, setAuthState } from '../ui/slices/authSlice'
// import { handleRedirect } from '../ui/slices/authActions'
// import { jwtDecode } from 'jwt-decode' 
// import { signIn } from '../ui/slices/authActions'
// import { useRouter } from 'next/navigation';
// import { acquireGraphToken } from '../utils/graphToken'

// // const REFRESH_THRESHOLD = 300; // 5 minutes in seconds
// const REFRESH_THRESHOLD = 300; // 5 minutes in seconds
// export default function StoreProvider({ children }) {
//   const [intervalId, setIntervalId] = useState(null);
//   const router = useRouter();

//   const setRefreshTime = (accessToken) => {
//     if (!accessToken) return null
//     try {
//       const decodedToken = jwtDecode(accessToken)
//       const currentTime = Math.floor(Date.now() / 1000)
//       const timeUntilExpiry = decodedToken.exp - currentTime - REFRESH_THRESHOLD
//       console.log('Time until token expiry:', timeUntilExpiry)
//       return timeUntilExpiry
//     } catch (error) {
//       // console.error('Invalid token:', error)
//       return null
//     }
//   }

//   const refreshAccessToken = async () => {
//     const accounts = msalInstance.getAllAccounts();
//     if (accounts.length === 0) {
//       store.dispatch(logout());
//       router.push('/');
//       return;
//     } 

//     const request = {
//       scopes: ["user.read"], // Add your required scopes
//       account: accounts[0]
//     };

//     try {
//       // Refresh the standard access token
//       const response = await msalInstance.acquireTokenSilent(request);
//       localStorage.setItem('accessTokens', response.accessToken);
      
//       // Refresh the Graph API access token using acquireGraphToken
//       const graphAccessToken = await acquireGraphToken(msalInstance, accounts[0]);
//       localStorage.setItem('graphAccessTokens', graphAccessToken);
  
//       // Update the state with the new tokens
//       store.dispatch(setAuthState({
//         isAuthenticated: true,
//         user: accounts[0],
//         accessToken: response.accessToken,
//         graphAccessToken: graphAccessToken,
//       }));
//     } catch (error) {
//       console.error('Failed to refresh tokens:', error);
//       store.dispatch(logout());
//       router.push('/');
//     }
//   };

// useEffect(() => {
//   if (typeof window === 'undefined') return;
//   const accounts = msalInstance.getAllAccounts();
//   const storedAccessToken = localStorage.getItem('accessTokens');
//   const graphAccessToken= localStorage.getItem('graphAccessTokens')
  
//   if (accounts.length > 0 && storedAccessToken) {
//     store.dispatch(setAuthState({
//       isAuthenticated: true,
//       user: accounts[0],
//       accessToken: storedAccessToken,
//       graphAccessToken
//     }));
//   } else {
//     router.push('/'); // Redirect to login page if not authenticated
//     return;
//   }

//   const refreshTokenCheck = async() => {
//     const currentToken = localStorage.getItem('accessTokens');
//     const backendRefreshTime = setRefreshTime(currentToken);
//     // const currentGraphToken= localStorage.getItem('graphAccessTokens')
//     // const backendGraphRefreshTime= setRefreshTime(currentGraphToken)

//     if (backendRefreshTime !== null && backendRefreshTime <= 0) {
//        await refreshAccessToken();
//     }

//     // if (backendGraphRefreshTime !== null && backendGraphRefreshTime <= 0) {
//     //   store.dispatch(logout())
//     //   router.push('/')
//     // }
//   };

//   const id = setInterval(refreshTokenCheck, 3000); // Check every 3 seconds
//   setIntervalId(id);

//   return () => clearInterval(id);
// }, [router]);


//   return(
//     <MsalProvider instance={msalInstance}>
//     <Provider store={store}>{children}</Provider>
//     </MsalProvider>
//   )
// }

'use client'
import React, { useEffect, useState } from 'react'
import { Provider } from 'react-redux'
import store from './store'
import { MsalProvider } from '@azure/msal-react'
import { msalInstance } from './msalConfig'
import { logout, setAuthState } from '../ui/slices/authSlice'
import { jwtDecode } from 'jwt-decode' 
import { useRouter } from 'next/navigation';
import { acquireGraphToken } from '../utils/graphToken'

const EXPIRY_THRESHOLD = 300; // 5 minutes in seconds

export default function StoreProvider({ children }) {
  const [intervalId, setIntervalId] = useState(null);
  const router = useRouter();

  // Helper to decode token and calculate time until expiry
  const setExpiryTime = (token) => {
    if (!token) return null;
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      const timeUntilExpiry = decodedToken.exp - currentTime - EXPIRY_THRESHOLD;
      console.log('Time until token expiry:', timeUntilExpiry)
      return timeUntilExpiry;
    } catch (error) {
      console.error('Invalid token:', error);
      return null;
    }
  };

  // Check if either token is expired
  const checkTokenExpiry = () => {
    const accessToken = localStorage.getItem('accessTokens');
    const graphAccessToken = localStorage.getItem('graphAccessTokens');

    const accessTokenExpiry = setExpiryTime(accessToken);
    const graphAccessTokenExpiry = setExpiryTime(graphAccessToken);

    if (accessTokenExpiry !== null && accessTokenExpiry <= 0) {
      console.log('Access token expired');
      store.dispatch(logout());
      router.push('/');
    } else if (graphAccessTokenExpiry !== null && graphAccessTokenExpiry <= 0) {
      console.log('Graph access token expired');
      store.dispatch(logout());
      router.push('/');
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Get account and token info
    const accounts = msalInstance.getAllAccounts();
    const accessToken = localStorage.getItem('accessTokens');
    const graphAccessToken = localStorage.getItem('graphAccessTokens');

    // Check if there is a valid user session
    if (accounts.length > 0 && accessToken && graphAccessToken) {
      // Validate token expiration before setting auth state
      const accessTokenExpiry = setExpiryTime(accessToken);
      const graphAccessTokenExpiry = setExpiryTime(graphAccessToken);

      if (accessTokenExpiry > 0 && graphAccessTokenExpiry > 0) {
        // Only set state if tokens are valid
        store.dispatch(setAuthState({
          isAuthenticated: true,
          user: accounts[0],
          accessToken,
          graphAccessToken
        }));
      } else {
        console.log('Token expired on initial load');
        store.dispatch(logout());
        router.push('/');
        return;
      }
    } else {
      // If no tokens or accounts, log out and redirect to login page
      router.push('/');
      return;
    }

    // Start token expiration check every 3 seconds
    const id = setInterval(checkTokenExpiry, 3000);
    setIntervalId(id);

    return () => clearInterval(id);
  }, [router]);

  return (
    <MsalProvider instance={msalInstance}>
      <Provider store={store}>{children}</Provider>
    </MsalProvider>
  );
}
