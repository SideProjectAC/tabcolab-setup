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