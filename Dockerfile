FROM node:22-slim AS base
COPY . /app
WORKDIR /app
RUN apt-get update
RUN apt-get install -y openssl

FROM base as pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm i -g pnpm

FROM pnpm AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM pnpm AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm exec prisma generate client
RUN pnpm run build

FROM base
RUN apt-get update
RUN apt-get install -y openssl
WORKDIR /app
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/build /app/build
COPY --from=build /app/node_modules/.prisma /app/node_modules/.prisma
COPY package.json package.json
EXPOSE 3000
CMD [ "node", "./build/index.js" ]