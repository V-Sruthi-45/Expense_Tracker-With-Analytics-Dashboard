# OAuth Setup Guide

## Google OAuth Setup

1. **Go to Google Cloud Console**
   - Visit https://console.cloud.google.com/
   - Create a new project or select existing one

2. **Enable OAuth APIs**
   - Go to "APIs & Services" > "Library"
   - Search and enable "Google+ API" and "Google People API"

3. **Create OAuth Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Select "Web application"
   - Add authorized redirect URI: `http://localhost:8080/auth/google/callback`
   - Copy Client ID and Client Secret

4. **Update Backend Code**
   - Replace `YOUR_GOOGLE_CLIENT_ID` with your actual Client ID
   - Replace `YOUR_GOOGLE_CLIENT_SECRET` with your actual Client Secret

## Microsoft OAuth Setup

1. **Go to Azure Portal**
   - Visit https://portal.azure.com/
   - Go to "Azure Active Directory"

2. **Register New Application**
   - Go to "App registrations" > "New registration"
   - Enter application name
   - Set redirect URI: `http://localhost:8080/auth/microsoft/callback`
   - Click "Register"

3. **Get Credentials**
   - Copy "Application (client) ID"
   - Go to "Certificates & secrets"
   - Create new client secret
   - Copy the secret value

4. **Update Backend Code**
   - Replace `YOUR_MICROSOFT_CLIENT_ID` with your Application ID
   - Replace `YOUR_MICROSOFT_CLIENT_SECRET` with your client secret

## Testing OAuth

1. **Start Backend Server**
   ```bash
   node mock-server.js
   ```

2. **Start Frontend Server**
   ```bash
   python -m http.server 8080
   ```

3. **Test OAuth Flow**
   - Visit http://localhost:8080
   - Click "Continue with Google" or "Continue with Microsoft"
   - You'll be redirected to the OAuth provider
   - After authorization, you'll be redirected back to your app

## Important Notes

- **Development Only**: This setup is for development/testing
- **HTTPS Required**: In production, you'll need HTTPS URLs
- **Domain Verification**: OAuth providers require verified domains in production
- **Scopes**: Adjust scopes based on your app's needs
- **Security**: Never expose client secrets in frontend code

## Troubleshooting

### Common Issues

1. **Redirect URI Mismatch**
   - Ensure redirect URI matches exactly in OAuth console and code
   - Check for trailing slashes

2. **CORS Issues**
   - OAuth providers handle CORS automatically
   - Backend CORS should allow your frontend domain

3. **Token Exchange Failures**
   - Check client ID and secret are correct
   - Ensure redirect URI matches

4. **User Info Access**
   - Verify requested scopes include email and profile
   - Check token hasn't expired

### Debug Mode

Add console logging to debug OAuth flow:
```javascript
console.log('OAuth redirect:', provider);
console.log('Callback params:', urlParams.toString());
```

## Production Considerations

1. **Use HTTPS** for all OAuth URLs
2. **Environment variables** for client secrets
3. **Token refresh** for long-lived sessions
4. **Error handling** for OAuth failures
5. **Rate limiting** for OAuth endpoints
