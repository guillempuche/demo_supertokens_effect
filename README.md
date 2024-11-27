# Demo: Effect Server with SuperTokens Authentication

This is a demonstration of integrating SuperTokens authentication with the Effect framework in a Node.js environment. The server showcases passwordless authentication, protected routes, and Effect's middleware system.

## Architecture Overview

The server is built using several key components:

- **Effect Framework**: Provides the core server functionality and type-safe error handling, routing and middleware
- **SuperTokens**: Handles authentication with passwordless login

### Server Flow

1. **Server Initialization**:
   - Environment variables are loaded through Effect's Config system
   - SuperTokens is initialized with passwordless authentication
   - CORS middleware is configured to handle SuperTokens headers
   - API routes are defined using Effect's HttpApiBuilder

2. **Authentication Flow**:
   - User requests come through CORS middleware
   - SuperTokens middleware validates authentication
   - Protected routes check session status
   - User metadata can be accessed for authenticated users

## Setup Instructions

### 1. Install Dependencies

```bash
yarn install
```

### 2. Configure Environment

1. Copy the `.env.example` file to `.env` for the server.
2. Copy the `.env.example` file to `.env` for the SuperTokens Docker.

### 3. Set Up SuperTokens

Install [Docker Desktop](https://www.docker.com/products/docker-desktop/) or alternatives like [OrbStack](https://orbstack.dev/) and start SuperTokens:

```bash
docker compose -f docker/supertokens/docker-compose.yaml up
```

### 4. Start the Server

```bash
yarn start
```

## Testing with Postman

You can test the authentication endpoints using Postman or similar API testing tools. Below are the key endpoints and how to test them:

- The server runs on `localhost:4040` by default
- Use cookie-based sessions by adding the `st-auth-mode: cookie` header
- Postman automatically manages cookies, so you don't need to manually handle them

### 1. Passwordless Sign In/Up

#### Request Magic Link

- **Method**: POST
- **URL**: `http://localhost:4040/auth/signinup/code`
- **Body** (raw JSON):

```json
{
    "email": "test@example.com"
}
```

- This will generate a magic link code (check your console logs in development)

#### Verify Code

- **Method**: POST
- **URL**: `http://localhost:4040/auth/signinup/code/consume`
- **Headers**:
  - `st-auth-mode`: `cookie`
- **Body** (raw JSON):

```json
{
    "preAuthSessionId": "[ID from previous response]",
    "deviceId": "[Device ID from previous response]",
    "userInputCode": "[Code from magic link/email]"
}
```

On success, Postman will automatically store the session cookies (`sAccessToken` and `sRefreshToken`).

### 2. Testing Protected Routes

For endpoints requiring authentication:

- Postman will automatically include the session cookies
- Example protected route test:
  - **Method**: GET
  - **URL**: `http://localhost:4040/api/protected`
  - The cookies from your sign-in will be automatically included

### 3. Session Refresh

If your access token expires:

- **Method**: POST
- **URL**: `http://localhost:4040/auth/session/refresh`
- Postman will automatically include the refresh token cookie
- New session tokens will be set in the cookies automatically

### 4. Sign Out

To end a session:

- **Method**: POST
- **URL**: `http://localhost:4040/auth/signout`
- This will clear the session cookies

### Common Issues

1. **401 Unauthorized**: Your session might have expired. Use the refresh endpoint to get new tokens.
2. **CORS Errors**: Make sure your Postman requests include any required CORS headers configured in your server.
3. **Cookie Issues**: Verify that you've included the `st-auth-mode: cookie` header during sign-in.

## Resources

- [SuperTokens Documentation](https://supertokens.com/docs/passwordless/introduction)
- [Effect Documentation](https://effect.website/)
- [Effect GitHub Repository](https://github.com/effect-ts/effect)

## TODO

- Is create server correct?

## License

MIT
