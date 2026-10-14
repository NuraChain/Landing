# The site, the blog, the api and the PDFs in one image - the same single process `npm start`
# runs, on one port.
#
#   docker build -t nura-landing .
#   docker run --rm -p 4200:4200 -e SITE_URL=https://nurachain.net nura-landing
#
# Behind nginx, Caddy or a tunnel, add `-e TRUST_PROXY=true` - see server/.env.example for why
# that is not optional there, and why it is not baked in here.

# Node 24 runs the server's TypeScript source as it is - there is no server build. Both stages
# share one base, glibc, whose bindings for rolldown, oxide and lightningcss are in the lockfile.
ARG NODE_VERSION=24.12.0

FROM node:${NODE_VERSION}-bookworm-slim AS build

WORKDIR /app

# The manifests alone first, so a content or source edit does not re-run the install. NODE_ENV
# stays unset in this stage: production would make `npm ci` drop vite, the compiler and tailwind.
COPY package.json package-lock.json ./
COPY application/package.json application/
COPY server/package.json server/
RUN npm ci --no-audit --no-fund

# Both halves, because `azeroth build` detects the full-stack layout from them.
COPY . .
RUN npm run build

FROM node:${NODE_VERSION}-bookworm-slim

ENV NODE_ENV=production
ENV PORT=4200

WORKDIR /app

# The server half's dependencies and nothing else. The SSR bundle inlines everything the
# application imports except `azerothjs`, which it must share with the server - one hoisted copy
# at /app/node_modules, which is why the repository's layout is kept as it is below.
COPY package.json package-lock.json ./
COPY application/package.json application/
COPY server/package.json server/
RUN npm ci --omit=dev --workspace server --no-audit --no-fund && npm cache clean --force

COPY --from=build /app/application/dist application/dist
COPY --from=build /app/application/dist-server application/dist-server
# content/ carries the blog, the whitepaper and its PDFs - main.ts refuses to boot without them.
COPY server/src server/src
COPY server/content server/content

# The NDJSON log is written under server/logs from the first line, so it is the one directory
# the unprivileged user has to own. Mount a volume there to keep it past the container.
RUN mkdir server/logs && chown node:node server/logs
USER node

# CLIENT_DIR, SSR_ENTRY and the --import below are all relative to the server half.
WORKDIR /app/server

EXPOSE 4200

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
    CMD ["node", "-e", "fetch('http://127.0.0.1:' + (process.env.PORT || 4200) + '/api/healthz').then((r) => process.exit(r.ok ? 0 : 1), () => process.exit(1))"]

# Node directly rather than `npm start`: npm as PID 1 does not hand SIGTERM on, so `docker stop`
# would wait out its timeout instead of reaching the server's own shutdown handler.
CMD ["node", "--import", "./src/deploy-env.ts", "src/main.ts"]
