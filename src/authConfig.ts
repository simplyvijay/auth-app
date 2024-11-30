import { Configuration, RedirectRequest } from '@azure/msal-browser';

export const msalConfig: Configuration = {
    auth: {
        clientId: 'your-client-id', // Replace with your Azure AD client ID
        authority: 'https://login.microsoftonline.com/your-tenant-id', // Replace with your Azure AD tenant ID
        redirectUri: 'http://localhost:5173/dashboard', // Replace with your redirect URI
    },
};

export const loginRequest: RedirectRequest = {
    scopes: ['user.read'],
};
