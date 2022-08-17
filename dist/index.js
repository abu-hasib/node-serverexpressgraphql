"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const apollo_server_core_1 = require("apollo-server-core");
const apollo_server_express_1 = require("apollo-server-express");
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const http_1 = __importDefault(require("http"));
const hello_1 = require("./resolvers/hello");
const type_graphql_1 = require("type-graphql");
const app = (0, express_1.default)();
const port = 4000;
app.use("/static", express_1.default.static(path_1.default.join(__dirname, "public")));
console.log("%%: ", path_1.default.join(__dirname, "public"));
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
const typeDefs = (0, apollo_server_core_1.gql) `
  type Query {
    "A simple type for getting started!"
    hello: String
  }
`;
async function startApolloServer() {
    const app = (0, express_1.default)();
    const httpServer = http_1.default.createServer(app);
    const server = new apollo_server_express_1.ApolloServer({
        schema: (0, type_graphql_1.buildSchemaSync)({ resolvers: [hello_1.HelloResolver] }),
        typeDefs,
        plugins: [(0, apollo_server_core_1.ApolloServerPluginDrainHttpServer)({ httpServer })],
    });
    app.get("/", (_, res) => {
        res.send("Hello World!");
    });
    await server.start();
    server.applyMiddleware({ app });
    await new Promise((resolve) => httpServer.listen({ port: 4001 }, resolve));
    console.log(`🚀 Server ready at http://localhost:4001${server.graphqlPath}`);
}
startApolloServer();
//# sourceMappingURL=index.js.map