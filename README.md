### Apps and Packages

- `client`: [Next.js](https://nextjs.org/) app
- `server`: [Nest.js](https://nestjs.com/) app
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Build

To build all apps and packages, run the following command:

```
cd [root]
turbo run build
```

### Develop

To develop all apps and packages, run the following command:

```
cd [root]
- linux - turbo run dev
- windows - turbo run dev:win
```

#### Env

# - Frontend:

NEXT_PUBLIC_BACKEND_DEV_URL=<br>
NEXT_PUBLIC_APP_ENV=<br>
NEXT_PUBLIC_BACKEND_PROD_URL=<br>
SESSION_SECRET=

# - Backend:

PORT=<br>
MONGO_URI=<br>
JWT_ACCESS_SECRET=<br>
JWT_ACCESS_EXPIRES_IN=<br>
JWT_REFRESH_SECRET=<br>
JWT_REFRESH_EXPIRES_IN=<br>
FRONTEND_URL=<br>

# Google Auth

GOOGLE_CLIENT_ID=<br>
GOOGLE_CLIENT_SECRET=<br>
GOOGLE_CALLBACK_URL=<br>
