const jsonServer = require("json-server");
const db = jsonServer.router("./mock-server/db.json").db;

const { generateGroupId, generateItemId } = require("../utils/generateId");

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
   *       content:
   *         application/json:
   *           example:
   *              statusCode: 404
   *              type: error
   *              message: No group in workspace
   */
};

const createGroupAtBlank = (group_id, group_icon, group_title) => {
  return {
    id: group_id,
    group_icon,
    group_title,
    items: {},
  };
};

const createGroupWithSidebarTabAtBlank = (
  group_id,
  group_icon,
  group_title,
  browserTab_favIconURL,
  browserTab_title,
  browserTab_url
) => {
  const item_id = generateItemId();
  return {
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
};

const createGroupWithGroupTabToBlank = (group_id, sourceGroup_id, item_id) => {
  const group = db.get("groups").find({ id: sourceGroup_id }).value();
  if (!group) {
    throw new Error("Group not found");
  }
  const item = group.items.find((item) => item.item_id === item_id);
  if (item === undefined) {
    throw new Error("Item not found in group");
  }
  return {
    id: group_id,
    group_title: "Untitle",
    group_icon: "default",
    items: { item },
  };
};

const groupCreators = {
  blank: createGroupAtBlank,
  sidebarTab: createGroupWithSidebarTabAtBlank,
  groupTab: createGroupWithGroupTabToBlank,
};

const determineGroupType = (req) => {
  const {
    group_icon,
    group_title,
    browserTab_favIconURL,
    browserTab_title,
    browserTab_url,
    item_id,
    sourceGroup_id,
  } = req.body;

  if (
    browserTab_favIconURL &&
    browserTab_title &&
    browserTab_url &&
    group_title &&
    group_icon
  ) {
    return "sidebarTab";
  } else if (group_icon && group_title) {
    return "blank";
  } else if (item_id && sourceGroup_id) {
    return "groupTab";
  } else {
    return null;
  }
};

const createGroup = (req, res) => {
  const group_id = generateGroupId();
  const groupType = determineGroupType(req);

  try {
    const groupCreator = groupCreators[groupType];
    if (!groupType || typeof groupCreator !== "function") {
      return res.status(400).json({ error: "Invalid request body" });
    }

    const newGroup = groupCreator(group_id, req.body);
    db.get("groups").push(newGroup).write();

    if (groupType === "blank") {
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
      return res.status(201).json({
        message: "New group successfully created in blank space",
        group_id,
      });
      /**
       * @openapi
       * components:
       *   responses:
       *     GroupatBlankCreatedResponse:
       *       description: Group created at blank space successfully
       *       type: object
       *       properties:
       *         group_id:
       *           $ref: '#/components/schemas/Group/properties/group_id'
       */
    } else if (groupType === "sidebarTab") {
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
      return res.status(201).json({
        message: "New group successfully created from a sidebar tab",
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
    } else if (groupType === "groupTab") {
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
      return res.status(201).json({
        message: "New group successfully created from another group's tab",
        group_id,
      });
      /**
       * @openapi
       * components:
       *   responses:
       *     GroupwithGroupTabCreatedResponse:
       *       description: Group created with tab from other group successfully
       *       type: object
       *       properties:
       *         group_id:
       *           $ref: '#/components/schemas/Group/properties/group_id'
       */
    } else {
      return res.status(400).json({ error: "Unknown group type" });
    }
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};

// const createGroup2 = (req, res) => {
//   const {
//     group_icon,
//     group_title,
//     browserTab_favIconURL,
//     browserTab_title,
//     browserTab_url,
//     item_id,
//     sourceGroup_id,
//   } = req.body;

//   const group_id = generateGroupId();
//   let newGroup;

//   try {
//     if (group_icon && group_title) {
//       newGroup = createGroupAtBlank(group_id, group_icon, group_title);
//       res.status(201).json({
//         message: "Group created with tab from other group successfully",
//         group_id,
//       });
//     } else if (
//       browserTab_favIconURL &&
//       browserTab_title &&
//       browserTab_url &&
//       group_title &&
//       group_icon
//     ) {
//       newGroup = createGroupWithSidebarTabAtBlank(
//         group_id,
//         group_icon,
//         group_title,
//         browserTab_favIconURL,
//         browserTab_title,
//         browserTab_url
//       );
//       res.status(201).json({
//         message: "Sidebar group created successfully",
//         group_id,
//         item_id,
//       });
//     } else if (item_id && sourceGroup_id) {
//       newGroup = createGroupWithGroupTabToBlank(
//         group_id,
//         sourceGroup_id,
//         item_id
//       );
//       res.status(201).json({
//         message: "Group created at blank space successfully",
//         group_id,
//       });
//     } else {
//       return res.status(400).json({ error: "Invalid request body" });
//     }

//     db.get("groups").push(newGroup).write();
//   } catch (error) {
//     return res.status(404).json({ error: error.message });
//   }
// };

// const createGroup = (req, res) => {
//   const {
//     group_icon,
//     group_title,
//     browserTab_favIconURL,
//     browserTab_title,
//     browserTab_url,
//     item_id,
//     sourceGroup_id,
//   } = req.body;

//   // Generate a unique group_id
//   const group_id = generateGroupId();

//   // Determine the type of the request body
//   let newGroup;
//   if (group_icon && group_title) {
//     // GroupCreateatBlank
//     /**
//      * @openapi
//      * components:
//      *   requestBodies:
//      *     GroupCreateatBlank:
//      *       description: Create Group at Blank Space.
//      *       type: object
//      *       properties:
//      *         group_icon:
//      *           $ref: '#/components/schemas/Group/properties/group_icon'
//      *         group_title:
//      *           $ref: '#/components/schemas/Group/properties/group_title'
//      */
//     newGroup = {
//       id: group_id,
//       group_icon,
//       group_title,
//       items: {},
//     };
//     res.status(201).json({
//       message: "Group created with tab from other group successfully",
//       group_id,
//     });
//     /**
//      * @openapi
//      * components:
//      *   responses:
//      *     GroupatBlankCreatedResponse:
//      *       description: Group created with tab from other group successfully
//      *       type: object
//      *       properties:
//      *         group_id:
//      *           $ref: '#/components/schemas/Group/properties/group_id'
//      */
//   } else if (
//     browserTab_favIconURL &&
//     browserTab_title &&
//     browserTab_url &&
//     group_title &&
//     group_icon
//   ) {
//     // GroupCreatewithSidebarTabatBlank
//     /**
//      * @openapi
//      * components:
//      *   requestBodies:
//      *     GroupCreatewithSidebarTabatBlank:
//      *       description: Create Group by Dragging a Tab From Sidebar to Blank Space.
//      *       type: object
//      *       properties:
//      *         browserTab_favIconURL:
//      *           $ref: '#/components/schemas/Item/properties/browserTab_favIconURL'
//      *         browserTab_title:
//      *           $ref: '#/components/schemas/Item/properties/browserTab_title'
//      *         browserTab_url:
//      *           $ref: '#/components/schemas/Item/properties/browserTab_url'
//      *         group_icon:
//      *           $ref: '#/components/schemas/Group/properties/group_icon'
//      *         group_title:
//      *           $ref: '#/components/schemas/Group/properties/group_title'
//      */
//     const item_id = generateItemId();
//     newGroup = {
//       id: group_id,
//       group_icon,
//       group_title,
//       items: {
//         browserTab_favIconURL,
//         browserTab_title,
//         browserTab_url,
//         item_id,
//       },
//     };
//     res.status(201).json({
//       message: "Sidebar group created successfully",
//       group_id,
//       item_id,
//     });
//     /**
//      * @openapi
//      * components:
//      *   responses:
//      *     GroupwithSidebarTabCreatedResponse:
//      *       description: Group created with tab from sidebar successfully
//      *       type: object
//      *       properties:
//      *         message:
//      *           type: string
//      *           value: Sidebar group created successfully
//      *         group_id:
//      *           $ref: '#/components/schemas/Group/properties/group_id'
//      *         item_id:
//      *           $ref: '#/components/schemas/Item/properties/item_id'
//      */
//   } else if (item_id && sourceGroup_id) {
//     //NOTE - 是不是要group_id比較有效能？
//     //NOTE - 新增group是否要由前端產生icon與title？
//     const group = db.get("groups").find({ id: sourceGroup_id }).value();
//     if (!group) {
//       return res.status(404).json({ error: "Group no found" });
//     }
//     const item = group.items.find((item) => item.item_id === item_id);
//     if (item === undefined) {
//       return res.status(404).json({ error: "Item no found in group" });
//     }
//     //GroupCreatewithGroupTabtoBlank
//     /**
//      * @openapi
//      * components:
//      *   requestBodies:
//      *     GroupCreatewithGroupTabtoBlank:
//      *       description: Create Group by Dragging a Tab From a Group to Blank Space.
//      *       type: object
//      *       properties:
//      *         sourceGroup_id:
//      *           $ref: '#/components/schemas/Group/properties/group_id'
//      *         item_id:
//      *           $ref: '#/components/schemas/Item/properties/item_id'
//      */
//     newGroup = {
//       id: group_id,
//       group_title: "Untitle",
//       group_icon: "default",
//       items: { item },
//     };
//     res
//       .status(201)
//       .json({ message: "Group created at blank space successfully", group_id });
//     /**
//      * @openapi
//      * components:
//      *   responses:
//      *     GroupwithGroupTabCreatedResponse:
//      *       description: group created at blank space successfully
//      *       type: object
//      *       properties:
//      *         group_id:
//      *           $ref: '#/components/schemas/Group/properties/group_id'
//      */
//   } else {
//     return res.status(400).json({ error: "Invalid request body" });
//   }

//   // Save the new group to the database
//   db.get("groups").push(newGroup).write();
// };

const updateGroup = async (req, res) => {
  const { group_id } = req.params;
  const { group_icon, group_title, group_pos } = req.body;

  try {
    const group = await db.get("groups").find({ id: group_id }).value();
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    if (group_icon && group_title) {
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

      await db.write();
      return res.json({ message: "Group updated successfully" });
    }

    if (group_pos !== undefined) {
      const groups = await db.get("groups").value();
      const groupIndex = groups.findIndex((group) => group.id === group_id);
      if (groupIndex === -1) {
        return res.status(404).json({ error: "Group not found" });
      }

      const targetIndex = group_pos;
      if (
        isNaN(targetIndex) ||
        targetIndex < 0 ||
        targetIndex >= groups.length
      ) {
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
      const [movedGroup] = groups.splice(groupIndex, 1);
      groups.splice(targetIndex, 0, movedGroup);
      await db.write();
      return res
        .status(200)
        .json({ message: "Group position updated successfully" });
    }

    return res.status(400).json({ error: "Invalid request body" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deleteGroup = async (req, res) => {
  const { group_id } = req.params;
  try {
    const group = await db.get("groups").find({ id: group_id }).value();
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }
    await db.get("groups").remove({ id: group_id }).write();
    return res.status(204).json({ message: "Group deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getGroups,
  createGroup,
  updateGroup,
  deleteGroup,
};
