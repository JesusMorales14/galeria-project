# syntax=docker/dockerfile:1.7
# Imagen de producción de Galería (apps/web). Multi-etapa: la imagen final solo lleva la
# salida «standalone» de Next.js (servidor + dependencias trazadas), sin código fuente ni
# dependencias de desarrollo, y se ejecuta con un usuario sin privilegios.

ARG NODE_VERSION=22

# --- 1. Compilación ---------------------------------------------------------------------
FROM node:${NODE_VERSION}-slim AS build
ENV NEXT_TELEMETRY_DISABLED=1 \
    NEXT_OUTPUT=standalone \
    CI=1
RUN corepack enable
WORKDIR /app

# Primero solo los manifiestos: si no cambian, Docker reutiliza la capa de dependencias.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/web/package.json apps/web/
COPY packages/api-client/package.json packages/api-client/
COPY packages/config/package.json packages/config/
COPY packages/ui/package.json packages/ui/
RUN pnpm install --frozen-lockfile --ignore-scripts

COPY . .
# Con el código ya copiado, los scripts de instalación (next typegen, binarios) se ejecutan
# sin volver a descargar nada.
RUN pnpm install --frozen-lockfile --offline

# Variables que Next.js incrusta en el build (Railway las pasa como build args).
ARG NEXT_PUBLIC_SITE_URL
ARG RAILWAY_PUBLIC_DOMAIN
ARG NEXT_PUBLIC_SENTRY_DSN
ARG SENTRY_ORG
ARG SENTRY_PROJECT
ARG SENTRY_AUTH_TOKEN
RUN pnpm turbo run build --filter=@galeria/web

# --- 2. Ejecución -----------------------------------------------------------------------
FROM node:${NODE_VERSION}-slim AS runner
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    HOSTNAME=0.0.0.0 \
    PORT=3000
WORKDIR /app

COPY --from=build --chown=node:node /app/apps/web/.next/standalone ./
COPY --from=build --chown=node:node /app/apps/web/.next/static ./apps/web/.next/static
# Migraciones: Railway las ejecuta antes de cada despliegue (preDeployCommand).
COPY --from=build --chown=node:node /app/apps/web/db ./apps/web/db
COPY --from=build --chown=node:node /app/apps/web/scripts/migrate.mjs ./apps/web/scripts/migrate.mjs

USER node
EXPOSE 3000
CMD ["node", "apps/web/server.js"]
