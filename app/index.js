const express = require("express");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");
const healthRoute = require("./routes/health-route");

const app = express();
const port = process.env.PORT || 3000;

// Swagger 設定
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Express API",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:80",
      },
    ],
  },
  apis: ["./routes/*.js"], // files containing annotations as above
};

app.use(cors());
app.use("/api/health", healthRoute);
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
