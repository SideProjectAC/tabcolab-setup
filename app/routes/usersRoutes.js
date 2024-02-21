// var express = require('express');
// var router = express.Router();
const jsonServer = require('json-server');
const router = jsonServer.create();

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });


const  userController = require( '../../controllers/userController.js')

/**
* @openapi
* /users/:id:
*   get:
*     tags: 
*       - Users
*     description: Returns user data based on the provided ID.
*     parameters:
*       - $ref: '#/parameters/userIdParam'
*     responses:
*       200:
*         description: User data retrieved successfully.
*         content:
*           application/json:
*             $ref: '#/responses/userIdResponse200'
*/

router.get('/:id', userController.getUserinfo);







module.exports = router;
