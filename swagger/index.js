const express = require("express");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const app = express();
const port = process.env.PORT || 5000;

const swaggerSetup = require("./config/swagger-setup");
swaggerSetup.setupSwaggerJsdoc(app);

app.get("/", (req, res) => {
  res.send('Welcome to swagger ui! <a href="/api-docs">Go to API docs</a>');
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
