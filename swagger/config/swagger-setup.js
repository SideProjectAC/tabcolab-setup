const swaggerUi = require("swagger-ui-express");

function setupSwaggerJson(server) {
  // Use Swagger Json
  const swaggerSpec = require("../data/swagger_output_json.json");

  server.use("/api-doc", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  return server;
}

function setupSwaggerJsdoc(server) {
  // Use Jsdoc
  const swaggerJsDoc = require("swagger-jsdoc");
  const options = {
    swaggerDefinition: {
      openapi: "3.0.0",
      info: {
        title: "Tabcolab",
        version: "1.0.0",
        description: "Your API Description",
      },
      servers: [
        {
          url: "http://localhost:5050", // json-server address
        },
      ],
      tags: [
        {
          name: "Groups",
          description: "Operations related to groups management",
        },
        {
          name: "Items(Spec)",
          description: "Specific operations related to items management",
        },
        {
          name: "Items",
          description: "General operations related to items management",
        },
      ],
    },
    apis: [
      "./routes/*.js",
      "./routes/modules/*.js",
      "./controllers/*.js",
      "./models/*.js",
    ], // files containing annotations as above
  };
  const swaggerDocs = swaggerJsDoc(options);

  server.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs)); //TODO static swagger
  // 返回 Express 应用程序对象

  return server;
}

module.exports = {
  setupSwaggerJson: setupSwaggerJson,
  setupSwaggerJsdoc: setupSwaggerJsdoc,
};
