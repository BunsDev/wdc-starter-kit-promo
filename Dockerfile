ARG BUN_VERSION=1.1.12
FROM oven/bun:${BUN_VERSION}-slim as base

WORKDIR /app

ENV NODE_ENV="production"

ARG DATABASE_URL
ARG DATABASE_AUTH_TOKE
ARG RESEND_AUDIENCE_I
ARG EMAIL_SERVER_PASSWORD

FROM base as build

RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential pkg-config python-is-python3

COPY --link bun.lockb package.json ./
RUN bun install --ci

COPY --link . .

RUN bun build:tailwind

FROM base

COPY --from=build /app /app

EXPOSE 3000
CMD [ "bun", "start" ]