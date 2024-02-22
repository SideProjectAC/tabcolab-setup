const jsonServer = require('json-server');
const router = jsonServer.create();
const controller = require('../../controllers/itemController');
const validateDataTypes =require("../../models/validateModel") 

router.patch('/groups/:group_id/items/:item_id',validateDataTypes, controller.moveItem);
router.delete('/groups/:group_id/items/:item_id',validateDataTypes, controller.deleteItem);

module.exports = router;
             
/**
 * @openapi
 * /groups/{group_id}/items/{item_id}:
 *   parameters:
 *     - name: group_id
 *       in: path
 *       required: true
 *       schema:
 *         $ref: '#/components/schemas/Group/properties/group_id'
 *       example: 1
 *     - name: item_id
 *       in: path
 *       required: true
 *       schema:
 *         $ref: '#/components/schemas/Item/properties/item_id'
 *       example: 1
 *   patch:
 *     tags:
 *       - Items
 *     summary: Move item (tab, note, todo) within or between existing Groups
 *     description: 'Move item (tab, note, todo) :<br> 1. Within existing Groups <br> 2. Between existing Groups'
 *     operationId: groupItemDragPatchGroup
 *     parameters:
 *       - name: item_type
 *         in: query
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/Item/properties/item_type'
 *         example: 0
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - $ref: '#/components/requestBodies/ItemMoveinGroup'
 *               - $ref: '#/components/requestBodies/ItemMovetoGroup'
 *           examples:
 *             ItemMoveinGroup:
 *               summary: Moving an item within the same group.
 *               value:
 *                 targetItem_position: 2
 *             ItemMovetoGroup:
 *               summary: Moving an item to a different group.
 *               value:
 *                 targetItem_position: 1
 *                 targetGroup_id: '2'
 *     responses:
 *       '200':
 *         description: Success
 *       '400':
 *         description: Bad Request
 *       '404':
 *         description: Not Found
 *   delete:
 *     tags:
 *       - Items
 *     summary: Remove item (tab, note, todo) from existing Group
 *     operationId: groupPatchItem
 *     responses:
 *       '204':
 *         description: Success
 *       '400':
 *         description: Bad Request
 *       '404':
 *         description: Not Found
 */
