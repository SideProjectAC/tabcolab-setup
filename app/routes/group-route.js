const jsonServer = require("json-server");
const router = jsonServer.create();
const controller = require("../../controllers/groupController");

router.get("/groups", controller.getGroups);
router.post("/groups", controller.createGroup);
router.patch("/groups/:group_id", controller.updateGroup);
router.delete("/groups/:group_id", controller.deleteGroup);

module.exports = router;

/**
 * @openapi
 * /groups:
 *   get:
 *     tags:
 *       - Groups
 *     summary: Display all groups and their items in workspace
 *     description: Display all groups and their items in workspace.
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/getGroups200'
 *             example:
 *               groups:
 *               - id: '1'
 *                 group_icon: group_icon_url
 *                 group_title: Group 1
 *                 items:
 *                   - item_id: '1'
 *                     item_type: 0
 *                     browserTab_favIconURL: favicon_url
 *                     browserTab_title: Tab Title
 *                     browserTab_url: tab_url
 *                     note_content: ''
 *                     note_bgColor: '#ffffff'
 *                   - item_id: '2'
 *                     item_type: 1
 *                     note_content: Note content
 *                     note_bgColor: '#ffffff'
 *                   - item_id: '3'
 *                     item_type: 2
 *                     doneStatus: false
 *       404:
 *         description: No group in workspace
 *         $ref: '#/components/responses/getGroups404'
 */
/**
 * @openapi
 * /groups:
 *   post:
 *     tags:
 *       - Groups
 *     summary: Create a new group in workspace
 *     description: 'Create a new group in the workspace. <br> It includes three scenarios:
 *       <br> 1. Create Group at Blank Space; <br> 2. Create Group by Dragging a Tab
 *       From Sidebar to Blank Space;<br> 3. Create Group by Dragging a Tab From a Group
 *       to Blank Space. '
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - $ref: '#/components/requestBodies/GroupCreateatBlank'
 *               - $ref: '#/components/requestBodies/GroupCreatewithSidebarTabatBlank'
 *               - $ref: '#/components/requestBodies/GroupCreatewithGroupTabtoBlank'
 *           examples:
 *             GroupCreateatBlank:
 *               summary: Group Create at Blank
 *               value:
 *                 group_icon: 'https://example.com/group_icon1.png'
 *                 group_title: Group 1
 *             GroupCreatewithSidebarTabatBlank:
 *               summary: Group Create with SidebarTab at Blank
 *               value:
 *                 browserTab_favIconURL: 'https://example.com/favicon.png'
 *                 browserTab_title: Example Tab Title
 *                 browserTab_url: 'https://example.com'
 *                 group_icon: 'https://example.com/group_icon2.png'
 *                 group_title: Group 2
 *             GroupCreatewithGroupTabtoBlank:
 *               summary: Group Create with Group Tab to Blank
 *               value:
 *                 sourceGroup_id: '1'
 *                 item_id: '1'
 *     responses:
 *       '201':
 *         description: Group created successfully
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/responses/GroupatBlankCreatedResponse'
 *                 - $ref: '#/components/responses/GroupwithSidebarTabCreatedResponse'
 *                 - $ref: '#/components/responses/GroupwithGroupTabCreatedResponse'
 *       '400':
 *         description: Bad Request
 */

/**
 * @openapi
 * /groups/{group_id}:
 *   patch:
 *     tags:
 *       - Groups
 *     summary: Modify group info or status
 *     description: 'Modify group information or status:<br> 1. Modify group icon, group title <br>2. Changing group position'
 *     parameters:
 *       - name: group_id
 *         in: path
 *         description: Group ID
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/Group/properties/group_id'
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - $ref: '#/components/requestBodies/GroupUpdate'
 *               - $ref: '#/components/requestBodies/GroupChangePos'
 *           examples:
 *             GroupUpdateExample:
 *               summary: Modifying group information
 *               value:
 *                 group_icon: 'https://example.com/updated_icon.png'
 *                 group_title: Updated Group Title
 *             GroupChangePosExample:
 *               summary: Changing group position
 *               value:
 *                 group_pos: 1
 *     responses:
 *       '200':
 *         description: Success
 *       '400':
 *         description: Bad Request
 *       '404':
 *         description: Not Found
 *   delete:
 *     tags:
 *       - Groups
 *     summary: Delete groups (including their tabs)
 *     description: Delete groups (including their tabs).
 *     parameters:
 *       - name: group_id
 *         in: path
 *         description: Group ID
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/Group/properties/group_id'
 *         example: 1
 *     responses:
 *       '204':
 *         description: Success
 *       '400':
 *         description: Bad Request
 *       '404':
 *         description: Not Found
 */
