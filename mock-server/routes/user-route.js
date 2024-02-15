const router = require("express").Router();
const userController = require("../controllers/user-controller");

// User local register
router.post("/register", userController.register);

module.exports = router;
