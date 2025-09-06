FROM node:lts-alpine AS base

FROM base AS builder

RUN apk update
RUN apk add --no-cache libc6-compat

# Set working directory
WORKDIR /app
RUN yarn global add turbo
COPY . .
RUN turbo prune server --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app

# First install dependencies (as they change less often)
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/yarn.lock ./yarn.lock
RUN yarn install

# Build the project and its dependencies
COPY --from=builder /app/out/full .
COPY turbo.json turbo.json

RUN yarn turbo run build --filter=server

FROM base AS runner
WORKDIR /app

COPY --from=installer /app .

WORKDIR /app/apps/server
EXPOSE 5000
CMD ["yarn","start"]