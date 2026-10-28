# syntax=docker/dockerfile:1.7
ARG BASE_IMAGE=node:22.11.0-slim
ARG BUILDER_IMAGE=node:22.11.0-slim

# ---------- Stage 1: Builder ----------
FROM ${BUILDER_IMAGE} AS builder
ARG SERVICE_PATH=.
ENV NODE_ENV=production
WORKDIR /build

COPY package.json package-lock.json* ./
RUN npm ci --include=dev

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

ARG GIT_SHA=unknown
ARG BUILD_DATE=unknown
LABEL org.opencontainers.image.source="https://github.com/Scaibu/web-app" \
      org.opencontainers.image.revision="${GIT_SHA}" \
      org.opencontainers.image.created="${BUILD_DATE}" \
      org.opencontainers.image.title="web-app"

USER ${UID}:${GID}
EXPOSE 31400
CMD ["node_modules/.bin/next", "start", "-p", "31400"]
