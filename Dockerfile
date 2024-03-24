ARG NODE_VERSION=20.10.0

FROM node:${NODE_VERSION} as base

ARG PORT=3000

ENV NODE_ENV=production

WORKDIR /src

FROM base as build

COPY --link . .
# RUN rm -rf node_modules
RUN npm install --production=false
RUN npx prisma generate

RUN npm run build
# RUN npm prune

FROM base

ENV PORT=$PORT

COPY --from=build /src/prisma /src/prisma
COPY --from=build /src/.output /src/.output

CMD [ "node", ".output/server/index.mjs" ]