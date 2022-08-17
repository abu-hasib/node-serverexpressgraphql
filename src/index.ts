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
  res.send("Hello World!");
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

// A map of functions which return data for the schema.
// const resolvers = {
//   Query: {
//     hello: () => "world",
//   },
// };

// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
// });

// server.listen().then(({ url }) => {
//   console.log(`🚀 Server ready at ${url}`);
// });

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

  await server.start();

  server.applyMiddleware({ app });

  await new Promise((resolve: any) =>
    httpServer.listen({ port: 8081 }, resolve)
  );

  console.log(`🚀 Server ready at http://localhost:8081${server.graphqlPath}`);
}

startApolloServer();
