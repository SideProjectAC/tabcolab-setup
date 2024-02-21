const jsonServer = require("json-server");
const db = jsonServer.router("./mock-server/db.json").db;

// const { generateGroupId, generateItemId } = require('../models/util'); // Import your utility module
const { generateGroupId } = require("../models/group");
const { generateItemId } = require("../models/item");

const getGroups = async (req, res) => {
  try {
    const groups = await db.get("groups").value();

    if (!groups) {
      res.status(404).json({ error: "No group in workspace" });
    } else {
      res.status(200).json(groups);
    }
  } catch (error) {
    // 資料庫連接失敗、讀取資料失敗或操作超時等錯誤將在這裡被捕獲
    res
      .status(500)
      .json({ error: "Database operation failed: " + error.message });
  }
  /**
   * @openapi
   * components:
   *   responses:
   *     getGroups200:
   *       schema:
   *          type: array
   *          items:
   *            $ref: '#/components/schemas/Group'
   *     getGroups404:
   *       description: No group in workspace
   *       content:
   *         application/json:
   *           example:
   *              statusCode: 404
   *              type: error
   *              message: No group in workspace
   */
};

const createGroup = (req, res) => {
  const {
    group_icon,
    group_title,
    browserTab_favIconURL,
    browserTab_title,
    browserTab_url,
    item_id,
    sourceGroup_id,
  } = req.body;

  // Generate a unique group_id
  const group_id = generateGroupId();

  // Determine the type of the request body
  let newGroup;
  if (group_icon && group_title) {
    // GroupCreateatBlank
    /**
     * @openapi
     * components:
     *   requestBodies:
     *     GroupCreateatBlank:
     *       description: Create Group at Blank Space.
     *       type: object
     *       properties:
     *         group_icon:
     *           $ref: '#/components/schemas/Group/properties/group_icon'
     *         group_title:
     *           $ref: '#/components/schemas/Group/properties/group_title'
     */
    newGroup = {
      id: group_id,
      group_icon,
      group_title,
      items: {},
    };
    res.status(201).json({
      message: "Group created with tab from other group successfully",
      group_id,
    });
    /**
     * @openapi
     * components:
     *   responses:
     *     GroupatBlankCreatedResponse:
     *       description: Group created with tab from other group successfully
     *       type: object
     *       properties:
     *         group_id:
     *           $ref: '#/components/schemas/Group/properties/group_id'
     */
  } else if (
    browserTab_favIconURL &&
    browserTab_title &&
    browserTab_url &&
    group_title &&
    group_icon
  ) {
    // GroupCreatewithSidebarTabatBlank
    /**
     * @openapi
     * components:
     *   requestBodies:
     *     GroupCreatewithSidebarTabatBlank:
     *       description: Create Group by Dragging a Tab From Sidebar to Blank Space.
     *       type: object
     *       properties:
     *         browserTab_favIconURL:
     *           $ref: '#/components/schemas/Item/properties/browserTab_favIconURL'
     *         browserTab_title:
     *           $ref: '#/components/schemas/Item/properties/browserTab_title'
     *         browserTab_url:
     *           $ref: '#/components/schemas/Item/properties/browserTab_url'
     *         group_icon:
     *           $ref: '#/components/schemas/Group/properties/group_icon'
     *         group_title:
     *           $ref: '#/components/schemas/Group/properties/group_title'
     */
    const item_id = generateItemId();
    newGroup = {
      id: group_id,
      group_icon,
      group_title,
      items: {
        browserTab_favIconURL,
        browserTab_title,
        browserTab_url,
        item_id,
      },
    };
    res.status(201).json({
      message: "Sidebar group created successfully",
      group_id,
      item_id,
    });
    /**
     * @openapi
     * components:
     *   responses:
     *     GroupwithSidebarTabCreatedResponse:
     *       description: Group created with tab from sidebar successfully
     *       type: object
     *       properties:
     *         message:
     *           type: string
     *           value: Sidebar group created successfully
     *         group_id:
     *           $ref: '#/components/schemas/Group/properties/group_id'
     *         item_id:
     *           $ref: '#/components/schemas/Item/properties/item_id'
     */
  } else if (item_id && sourceGroup_id) {
    //NOTE - 是不是要group_id比較有效能？
    //NOTE - 新增group是否要由前端產生icon與title？
    const group = db.get("groups").find({ id: sourceGroup_id }).value();
    if (!group) {
      return res.status(404).json({ error: "Group no found" });
    }
    const item = group.items.find((item) => item.item_id === item_id);
    if (item === undefined) {
      return res.status(404).json({ error: "Item no found in group" });
    }
    //GroupCreatewithGroupTabtoBlank
    /**
     * @openapi
     * components:
     *   requestBodies:
     *     GroupCreatewithGroupTabtoBlank:
     *       description: Create Group by Dragging a Tab From a Group to Blank Space.
     *       type: object
     *       properties:
     *         sourceGroup_id:
     *           $ref: '#/components/schemas/Group/properties/group_id'
     *         item_id:
     *           $ref: '#/components/schemas/Item/properties/item_id'
     */
    newGroup = {
      id: group_id,
      group_title: "Untitle",
      group_icon: "default",
      items: { item },
    };
    res
      .status(201)
      .json({ message: "Group created at blank space successfully", group_id });
    /**
     * @openapi
     * components:
     *   responses:
     *     GroupwithGroupTabCreatedResponse:
     *       description: group created at blank space successfully
     *       type: object
     *       properties:
     *         group_id:
     *           $ref: '#/components/schemas/Group/properties/group_id'
     */
  } else {
    return res.status(400).json({ error: "Invalid request body" });
  }

  // Save the new group to the database
  db.get("groups").push(newGroup).write();
};

const updateGroup = (req, res) => {
  const { group_id } = req.params;
  const group = db.get("groups").find({ id: group_id }).value();
  if (!group) {
    return res.status(404).json({ error: "Group not found" });
  }

  const { group_icon, group_title, group_pos } = req.body;
  if (group_id && group_icon && group_title) {
    group.group_icon = group_icon;
    group.group_title = group_title;

    /**
     * @openapi
     * components:
     *   requestBodies:
     *     GroupUpdate:
     *       description: Change group info.
     *       type: object
     *       properties:
     *         group_icon:
     *           $ref: '#/components/schemas/Group/properties/group_icon'
     *         group_title:
     *           $ref: '#/components/schemas/Group/properties/group_title'
     */

    db.write();
    res.json({ message: "Group updated successfully" });
  } else if (group_id && group_pos !== undefined) {
    const groups = db.get("groups").value();

    const groupIndex = groups.findIndex((group) => group.id === group_id);
    if (groupIndex === -1) {
      return res.status(404).json({ error: "Group not found" });
    }

    const targetIndex = group_pos;
    if (isNaN(targetIndex) || targetIndex < 0 || targetIndex >= groups.length) {
      return res.status(400).json({ error: "Invalid target position" });
    }
    /**
     * @openapi
     * components:
     *   requestBodies:
     *     GroupChangePos:
     *       description: Change group position.
     *       type: object
     *       properties:
     *         group_pos:
     *           type: integer
     *           minimum: 0
     */

    // Remove the group from its current position
    const [movedGroup] = groups.splice(groupIndex, 1);

    // Insert the group at the new position
    groups.splice(targetIndex, 0, movedGroup);
    db.write();
    res.status(200).json({ message: "Group position updated successfully" });
  } else {
    return res.status(400).json({ error: "Invalid request body" });
  }
};

const deleteGroup = (req, res) => {
  const { group_id } = req.params;
  const group = db.get("groups").find({ id: group_id }).value();
  if (!group) {
    return res.status(404).json({ error: "Group not found" });
  }
  //NOTE - 沒有規定req body ，那需要有"Invalid request body？
  if (group) {
    db.get("groups").remove({ id: group_id }).write();
    return res.status(204).json({ message: "Group deleted successfully" });
  } else {
    return res.status(400).json({ error: "Invalid request body" });
  }
};

module.exports = {
  getGroups,
  createGroup,
  updateGroup,
  deleteGroup,
};
