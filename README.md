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

## Resources

- [SuperTokens Documentation](https://supertokens.com/docs/passwordless/introduction)
- [Effect Documentation](https://effect.website/)
- [Effect GitHub Repository](https://github.com/effect-ts/effect)

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT
