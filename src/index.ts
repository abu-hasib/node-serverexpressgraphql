import "reflect-metadata";
import { ApolloServerPluginDrainHttpServer, gql } from "apollo-server-core";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import path from "path";
import http from "http";
import { HelloResolver } from "./resolvers/hello";
import { buildSchemaSync } from "type-graphql";

const app = express();
const port = 8080;

app.use("/static", express.static(path.join(__dirname, "public")));

console.log("%%: ", path.join(__dirname, "public"));

app.get("/", (_, res) => {
  res.send("New Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// The GraphQL schema
const typeDefs = gql`
  type Query {
    "A simple type for getting started!"
    hello: String
  }
`;

async function startApolloServer() {
  const app = express();

  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    schema: buildSchemaSync({ resolvers: [HelloResolver] }),
    typeDefs,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  app.get("/", (_, res) => {
    res.send("Hello World!");
  });

  app.get("/users", (_, res) => {
    res.send("returned all users");
  });

  app.post("/", (_, res) => {
    res.send("Got a POST request");
  });

  app.put("/user", (_, res) => {
    res.send("Got a PUT request at /user");
  });

  app.delete("/user", (_, res) => {
    res.send("Got a DELETE request at /user");
  });

  await server.start();

  server.applyMiddleware({ app });

  app.use((_, res) => {
    res.status(200);

    res.send("Hello!");

    res.end();
  });

  await new Promise((resolve: any) => app.listen({ port: 8081 }, resolve));

  console.log(`🚀 Server ready at http://localhost:8081${server.graphqlPath}`);
  return { server, app };
}

startApolloServer();
