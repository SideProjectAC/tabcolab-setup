const jsonServer = require('json-server');
const router = jsonServer.create();
const controller = require('../../controllers/specItemController');
const validateDataTypes =require("../../models/validateModel") 

router.post('/groups/:group_id/tabs',validateDataTypes, controller.addTab);
router.patch('/groups/:group_id/tabs/:item_id',validateDataTypes, controller.updateTab);
router.post('/groups/:group_id/notes',validateDataTypes, controller.addNote);
router.patch('/groups/:group_id/notes/:item_id',validateDataTypes, controller.updateNote);
router.patch('/groups/:group_id/todos/:item_id',validateDataTypes, controller.updateTodo);

module.exports = router;


/**
 * @openapi
 * /groups/{group_id}/tabs:
 *   parameters:
 *     - name: group_id
 *       in: path
 *       required: true
 *       schema:
 *         $ref: '#/components/schemas/Group/properties/group_id'
 *       example: 1
 *   post:
 *     tags:
 *       - Items(Spec)
 *     summary: Add a new tab to an existing Group by dragging from Sidebar
 *     operationId: sidebarDragCreateGroupTab
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/requestBodies/addTab'
 *     responses:
 *       '201':
 *         description: Created
 *       '400':
 *         description: Bad Request
 */
 
/**
 * @openapi
 * /groups/{group_id}/tabs/{item_id}:
 *   parameters:
 *     - name: group_id
 *       in: path
 *       required: true
 *       schema:
 *         $ref: '#/components/schemas/Group/properties/group_id'
 *       example: 2
 *     - name: item_id
 *       in: path
 *       required: true
 *       schema:
 *         $ref: '#/components/schemas/Item/properties/item_id'
 *       example: 3
 *   patch:
 *     tags:
 *       - Items(Spec)
 *     summary: Add or Modify a note within a tab
 *     operationId: groupTabPatchNote
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/requestBodies/updateTab'
 *     responses:
 *       '200':
 *         description: Success
 *       '400':
 *         description: Bad Request
 *       '404':
 *         description: Not Found
 */

 
/**
 * @openapi
 * /groups/{group_id}/notes:
 *   post:
 *     tags:
 *       - Items(Spec)
 *     summary: Add a note to an existing group
 *     description: Add a note to an existing group.
 *     parameters:
 *       - name: group_id
 *         in: path
 *         description: Group ID
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/Group/properties/group_id'
 *         example: '2'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/requestBodies/addNote'
 *     responses:
 *       '201':
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 item_id:
 *                   $ref: '#/components/schemas/Item/properties/item_id'
 *       '400':
 *         description: Bad Request
 */
 
/**
 * @openapi
 * /groups/{group_id}/notes/{item_id}:
 *   patch:
 *     tags:
 *       - Items(Spec)
 *     summary: Change a note to a todo in an existing group
 *     description: Change a note to a todo in an existing group.
 *     parameters:
 *       - name: group_id
 *         in: path
 *         description: Group ID
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/Group/properties/group_id'
 *         example: 2
 *       - name: item_id
 *         in: path
 *         description: Item ID
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/Item/properties/item_id'
 *         example: 5
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/requestBodies/TabNoteChangetoTodo'
 *     responses:
 *       '200':
 *         description: Success
 *       '400':
 *         description: Bad Request
 *       '404':
 *         description: Not Found
 */
 
/**
 * @openapi
 * /groups/{group_id}/todos/{item_id}:
 *   patch:
 *     tags:
 *       - Items(Spec)
 *     summary: Change a todo status in an existing group
 *     description: 'Change a todo status in an existing group. <br> 1. Change item type of todo to note <br>2. Update the doneStatus of  todo'
 *     parameters:
 *       - name: group_id
 *         in: path
 *         description: Group ID
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/Group/properties/group_id'
 *         example: 2
 *       - name: item_id
 *         in: path
 *         description: Item ID
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/Item/properties/item_id'
 *         example: 6
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - $ref: '#/components/requestBodies/TodoChangetoNote'
 *               - $ref: '#/components/requestBodies/TodoStatusUpdate'
 *           examples:
 *             TodotoNoteExample:
 *               summary: Change todo to note
 *               value:
 *                 item_type: 1
 *             TodoStatusUpdateExample:
 *               summary: Update todo status
 *               value:
 *                 doneStatus: true
 *     responses:
 *       '200':
 *         description: Success
 *       '400':
 *         description: Bad Request
 *       '404':
 *         description: Not Found
 */