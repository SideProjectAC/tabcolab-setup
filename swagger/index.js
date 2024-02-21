const express = require("express");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const app = express();
const port = process.env.PORT || 5000;

// Swagger 設定
// const swaggerOptions = {
//   definition: {
//     openapi: "3.0.0",
//     info: {
//       title: "Express API",
//       version: "1.0.0",
//     },
//     servers: [
//       {
//         url: "http://localhost:5000",
//       },
//     ],
//   },
//   apis: ["./routes/*.js"], // files containing annotations as above
// };

const swaggerSetup = require("./config/swagger-setup");
swaggerSetup.setupSwaggerJsdoc(app);

app.get("/", (req, res) => {
  res.send('Welcome to swagger ui! <a href="/api-docs">Go to API docs</a>');
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
