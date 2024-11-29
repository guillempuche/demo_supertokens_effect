# Demo: Effect Server with SuperTokens Authentication

This is a demonstration of integrating SuperTokens authentication with the Effect framework in a Node.js environment. The server showcases passwordless authentication, protected routes, and Effect's middleware system.

## Architecture Overview

The server is built using several key components:

- **Effect Framework**: Provides the core server functionality and type-safe error handling, routing and middleware
- **SuperTokens**: Handles authentication with passwordless login
- **React**: Frontend web application
- **Inbucket**: Local SMTP server for testing emails

### Server Flow

1. **Server Initialization**:
   - Environment variables are loaded through Effect's Config system
   - SuperTokens is initialized with passwordless authentication
   - CORS middleware is configured to handle SuperTokens headers
   - API routes are defined using Effect's HttpApiBuilder

2. **Authentication Flow**:
   - User enters any email address for passwordless login
   - Magic link code is sent to local SMTP server (viewable at localhost:9000)
   - User enters the code to authenticate
   - Protected routes check session status
   - User metadata can be accessed for authenticated users

## Setup Instructions

### 1. Install Dependencies

```bash
yarn install
```

### 2. Configure Environment

1. Copy the `.env.example` file to `.env` in the server app
2. Copy the `.env.example` file to `.env` in the web app
3. Copy the `.env.example` file to `.env` for the SuperTokens Docker

### 3. Set Up Docker Containers

Install [Docker Desktop](https://www.docker.com/products/docker-desktop/) or alternatives like [OrbStack](https://orbstack.dev/) and start the required services:

Run the following commands to start the containers:

```bash
docker compose -f docker/email/docker-compose.yaml up -d
docker compose -f docker/supertokens/docker-compose.yaml up -d
```

> [!NOTE] For stopping the containers:
>
> ```bash
> docker compose -f docker/email/docker-compose.yaml down
> docker compose -f docker/supertokens/docker-compose.yaml down
> ```

### 4. Start the Applications

Start both the server and web applications in separate terminal windows:

```bash
# Terminal 1 - Start the server (runs on localhost:4040)
yarn workspace @demo/server start

# Terminal 2 - Start the web app (runs on localhost:3000)
yarn workspace @demo/web start
```

## Testing the Authentication Flow

1. Open `http://localhost:3000` in your browser
2. Enter any email address in the login form
3. Open `http://localhost:9000` in a new tab to access the Inbucket email interface
4. Find your email and copy the magic link code
5. Enter the code in the verification form
6. You'll be logged in and can access protected routes

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

- [Supertokens Passwordless Backend](https://supertokens.com/docs/passwordless/custom-ui/init/backend)
- [Effect Documentation](https://effect.website/)
- [Effect GitHub Repository](https://github.com/effect-ts/effect)

## TODO

- Load Supertokens' Session singleton (middleware.ts)
- Load Supertokens' UserMetadata singleton (middleware.ts)
- Verify session (middleware.ts)
- Initialize supertokens.ts when starting server
- Load environment variables in places using `Config.string` (like in supertokens.ts and cors.ts)
- Build server in index.ts

## License

MIT
