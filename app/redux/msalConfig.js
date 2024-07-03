import { PublicClientApplication } from "@azure/msal-browser";

const msalConfig ={
    auth:{
        clientId:process.env.NEXT_PUBLIC_CLIENT_ID,
        authority:process.env.NEXT_PUBLIC_AUTHORITY,
        redirectUri:process.env.NEXT_PUBLIC_REDIRECT_URI,

    },
    cache: {
        cacheLocation: 'localStorage',
        storeAuthStateInCookie: true,
      },
      scopes: ["https://api.businesscentral.dynamics.com/.default"],
      system: {
        tokenRenewalOffsetSeconds: 300, // Attempt to renew the token 5 minutes before it expires
      },
}

// console.log(msalConfig)

export const msalInstance = new PublicClientApplication(msalConfig);