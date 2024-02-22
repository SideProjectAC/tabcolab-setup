const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  email: String,
  password: String,
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

module.exports = User;

/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         username:
 *           type: string
 *           example: "John Doe"
 *         age:
 *           type: integer
 *           format: int32
 *           example: 30
 *         email:
 *           type: string
 *           format: email
 *           example: "john.doe@example.com"
 *         groups:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Group'
 *       required:
 *         - username
 *         - age
 *         - email
 */
