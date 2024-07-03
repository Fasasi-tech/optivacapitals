export const acquireGraphToken = async (instance, account) => {
    const tokenRequest = {
      scopes: ['User.Read', 'User.ReadWrite', 'User.ReadWrite.All'],
      account: account,
    };
  
    try {
      const tokenResponse = await instance.acquireTokenSilent(tokenRequest);
      return tokenResponse.accessToken;
    } catch (silentError) {
      console.error('Silent token acquisition for Graph API failed:', silentError);
      // Fallback to acquire token interactively if silent acquisition fails
      if (silentError instanceof InteractionRequiredAuthError) {
        try {
          const tokenResponse = await instance.acquireTokenPopup(tokenRequest);
          return tokenResponse.accessToken;
        } catch (popupError) {
          console.error('Interactive token acquisition for Graph API failed:', popupError);
          throw popupError;
        }
      } else {
        throw silentError;
      }
    }
  };