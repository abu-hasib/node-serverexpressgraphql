# syntax=docker/dockerfile:1
FROM node:12-alpine
# RUN apk add --no-cache python2 g++ make
WORKDIR /src
COPY . .
RUN yarn install --production
RUN yarn add typescript
RUN yarn build
CMD ["node", "dist/index.js"]
EXPOSE 80
