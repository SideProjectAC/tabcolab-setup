const jsonServer = require("json-server");
const db = jsonServer.router("./mock-server/db.json").db;

const moveItem = async (req, res) => {
  try {
    const { group_id, item_id } = req.params;
    const groups = await db.get("groups").value();
    const sourceGroup = groups.find((group) => group.id === group_id);
    if (!sourceGroup) {
      return res.status(404).json({ error: "Source group not found" });
    }

    const itemIndex = sourceGroup.items.findIndex(
      (item) => item.item_id === item_id
    );
    if (itemIndex === -1) {
      return res.status(404).json({ error: "Item not found in source group" });
    }

    const { targetGroup_id, targetItem_position } = req.body;
    let targetGroup = groups.find((group) => group.id === targetGroup_id);

    if (
      targetGroup &&
      targetItem_position !== undefined &&
      (typeof targetItem_position !== "number" || targetItem_position < 0)
    ) {
      return res.status(400).json({ error: "Invalid target item position" });
    } else if (itemIndex !== undefined && targetItem_position !== undefined) {
      //ItemMoveinGroup
      /**
       * @openapi
       * components:
       *   requestBodies:
       *     ItemMoveinGroup:
       *       description: Move item within existing Groups
       *       type: object
       *       properties:
       *         targetItem_position:
       *           type: integer
       *           minimum: 0
       */
      if (!targetGroup) {
        targetGroup = sourceGroup;
      }
      //ItemMovetoGroup
      /**
       * @openapi
       * components:
       *   requestBodies:
       *     ItemMovetoGroup:
       *       description: Move item between existing Groups
       *       type: object
       *       properties:
       *         targetItem_position:
       *           type: integer
       *         targetGroup_id:
       *           $ref: '#/components/schemas/Group/properties/group_id'
       */
      // Remove the item from the source group
      const itemToMove = sourceGroup.items.splice(itemIndex, 1)[0];
      // Determine the target position
      let newPosition = targetItem_position;
      if (newPosition > targetGroup.items.length) {
        // If the target position is beyond the length of the target group, move to the end
        newPosition = targetGroup.items.length;
      } else if (newPosition < 0) {
        // If the target position is negative, move to the beginning
        newPosition = 0;
      }

      targetGroup.items.splice(newPosition, 0, itemToMove);
      await db.write();
      res.status(200).json({ message: "Item moved successfully", item_id });
    } else {
      return res.status(400).json({ error: "Invalid request body" });
    }
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};

const deleteItem = async (req, res) => {
  try {
    const { group_id, item_id } = req.params;
    const group = await db.get("groups").find({ id: group_id }).value();
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }
    const index = group.items.findIndex((item) => item.item_id === item_id);
    if (index === -1) {
      return res.status(404).json({ error: "Item not found in group" });
    }

    group.items.splice(index, 1);
    await db.write();
    return res
      .status(204)
      .header("X-Message", "Item removed from group successfully")
      .send();
  } catch (error) {
    return res.status(500).json({ error: error.toString() });
  }
};

module.exports = {
  moveItem,
  deleteItem,
};
