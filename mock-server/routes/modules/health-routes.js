const router = require("express").Router();

router.use((req, res, next) => {
  console.log("正在接受一個跟health有關的請求");
  next();
});

/**
 * @swagger
 * info:
 *   title: health
 *   version: 1.0.0
 * /api/health:
 *   get:
 *     summary: Health check endpoint
 *     description: Use to check the health of the service
 *     responses:
 *       '200':
 *         description: The service is healthy
 */
const { healthCheckHandler } = require("../controllers/health-controller");
router.get("/", healthCheckHandler);

module.exports = router;
