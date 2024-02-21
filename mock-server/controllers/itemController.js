const jsonServer = require('json-server');
const db = jsonServer.router('./mock-server/db.json').db; 

function moveItem(req, res) {

    const { group_id, item_id } = req.params;
    const groups = db.get('groups').value();
    const sourceGroup = groups.find(group => group.id === group_id);
    if (!sourceGroup) {
      return res.status(404).json({ error: "Source group not found" });
    }

    const itemIndex = sourceGroup ? sourceGroup.items.findIndex(item => item.item_id === item_id) : undefined;
    if (itemIndex === -1) {
      return res.status(404).json({ error: "Item not found in source group" });
    }
    const { item_type } = req.query;
    const itemTypeIndex = sourceGroup ? sourceGroup.items.findIndex(item => item.item_type === parseInt(item_type)) : undefined;
    if (itemTypeIndex === -1) {
      return res.status(404).json({ error: "Item Type error in source group" });
    } 

    const { targetGroup_id, targetItem_position } = req.body;
    let targetGroup = groups.find(group => group.id === targetGroup_id);
 
    //FIXME - 
    if (targetGroup&&targetItem_position !== undefined && (typeof targetItem_position !== 'number' || targetItem_position < 0)) {
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
  
      //FIXME 超過長度會移到尾端
      // Determine the target position
      let newPosition = targetItem_position;
      if (newPosition > targetGroup.items.length) {
        // If the target position is beyond the length of the target group, move to the end
        newPosition = targetGroup.items.length;
      } else if (newPosition < 0) {
        // If the target position is negative, move to the beginning
        newPosition = 0;
      }
      // Insert the item into the target group at the specified position
      targetGroup.items.splice(newPosition, 0, itemToMove);
      db.write();
      res.status(200).json({ message: "Item moved successfully", item_id });
  
    } 
    else {
      return res.status(400).json({ error: "Invalid request body" });
    }
}

function deleteItem(req, res) {
    const { group_id, item_id } = req.params;
    const group = db.get('groups').find({ id: group_id }).value();
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }
    const index = group.items.findIndex(item => item.item_id === item_id);
    if (index === -1) {
      return res.status(404).json({ error: "Item not found in group" });
    }
    //FIXME - 兩個req body同時錯誤時要出什麼錯誤？？只出現前一個嗎？
    //FIXME - 非合法字串要提醒嗎？
   
    
    if (group && index !== -1) { //NOTE 是不是窮盡了 用不著400？Invalid request parameters怎麼處理。
      group.items.splice(index, 1);
      db.write();
      //NOTE -  204 不應該有message
      return res.status(204).header("X-Message", "Item removed from group successfully").send();
    } 
    else {
      return res.status(400).json({ error: "Invalid request parameters" });
    }
}

module.exports = {
    moveItem,
    deleteItem
};
