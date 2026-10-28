# syntax=docker/dockerfile:1.7
ARG BASE_IMAGE=node:22-slim@sha256:4b150b48b4116e2a22f2c39cc27025fbf4f153e2078fd3b14d159fdb5c7279da
ARG BUILDER_IMAGE=node:22-slim@sha256:4b150b48b4116e2a22f2c39cc27025fbf4f153e2078fd3b14d159fdb5c7279da

# ---------- Stage 1: Builder ----------
FROM ${BUILDER_IMAGE} AS builder
ARG SERVICE_PATH=.
WORKDIR /build

COPY package.json package-lock.json* ./
COPY vendor/ ./vendor/
RUN npm install

COPY . ./
RUN npm run build \
 && npm prune --omit=dev

# ---------- Stage 2: Runtime ----------
FROM ${BASE_IMAGE} AS runtime
ARG SERVICE_PATH=.
ARG UID=10001
ARG GID=10001

RUN groupadd --gid ${GID} app \
 && useradd --uid ${UID} --gid ${GID} --no-create-home --shell /usr/sbin/nologin app \
 && mkdir -p /app && chown ${UID}:${GID} /app

ENV NODE_ENV=production PORT=31400 HOSTNAME=0.0.0.0 HOME=/tmp
WORKDIR /app

COPY --from=builder --chown=${UID}:${GID} /build/package.json ./package.json
COPY --from=builder --chown=${UID}:${GID} /build/node_modules ./node_modules
COPY --from=builder --chown=${UID}:${GID} /build/.build ./.build
COPY --from=builder --chown=${UID}:${GID} /build/public ./public
COPY --from=builder --chown=${UID}:${GID} /build/next.config.ts ./next.config.ts

ARG GIT_SHA=unknown
ARG BUILD_DATE=unknown
LABEL org.opencontainers.image.source="https://github.com/Scaibu/web-app" \
      org.opencontainers.image.revision="${GIT_SHA}" \
      org.opencontainers.image.created="${BUILD_DATE}" \
      org.opencontainers.image.title="web-app"

USER ${UID}:${GID}
EXPOSE 31400
STOPSIGNAL SIGTERM
CMD ["node_modules/.bin/next", "start", "-p", "31400"]
