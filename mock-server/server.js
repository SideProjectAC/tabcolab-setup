const jsonServer = require("json-server");
const express = require("express");
const server = express();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
const userRoute = require("./routes/user-route");

const { v4: uuidv4 } = require("uuid");

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.use("/users", userRoute);
server.use(router);

server.listen(4000, () => {
  console.log("Server is running");
});
