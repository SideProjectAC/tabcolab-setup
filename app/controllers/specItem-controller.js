const jsonServer = require('json-server');
const db = jsonServer.router('./mock-server/db.json').db; 
const { generateItemId } = require('../models/item'); // Import your utility module

exports.addTab = (req, res) => {
    //NOTE- 建構位置（是否存在）
    const { group_id } = req.params;
    const group = db.get('groups').find({ id: group_id }).value();
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    } 
    //NOTE- 建構材料（是否正確）
    const { browserTab_favIconURL, browserTab_title, browserTab_url,targetItem_position} = req.body;
    if (group_id && browserTab_favIconURL && browserTab_title && browserTab_url&&targetItem_position!=undefined) {
      const newTab = {
        item_id: generateItemId(),
        item_type: 0, // Assuming 0 represents a tab
        browserTab_favIconURL,
        browserTab_title,
        browserTab_url
      };
        /** 
         * @openapi
         * components:
         *   requestBodies:
         *     addTab:
         *       description: Add a new tab to an existing Group by dragging from Sidebar
         *       type: object
         *       properties:
         *         browserTab_favIconURL:
         *           $ref: '#/components/schemas/Item/properties/browserTab_favIconURL'
         *         browserTab_title:
         *           $ref: '#/components/schemas/Item/properties/browserTab_title'
         *         browserTab_url:
         *           $ref: '#/components/schemas/Item/properties/browserTab_url'
         *         targetItem_position:
         *           type: integer
         *           minimum: 0
         */

        // Ensure that targetItem_position is within a valid range
        if (targetItem_position >= 0 && targetItem_position <= group.items.length) {
          // Use splice to insert newTab at the specified position
          group.items.splice(targetItem_position, 0, newTab);
        } else {
          // If the target position is out of the array's range, newTab will be inserted at the end of the array by default
          group.items.push(newTab);
        }
        db.write();
  
      res.status(201).json({ message: "New tab added to group successfully", item_id: newTab.item_id });
    } else {
       //NOTE- 建構材料（是否足夠）
      return res.status(400).json({ error: "Invalid request body" });
    }
};

exports.updateTab = (req, res) => {
    const { group_id, item_id } = req.params;
    const group = db.get('groups').find({ id: group_id }).value();
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }
    const tab = group.items.find(item => item.item_id === item_id && item.item_type === 0);
    if (!tab) {
      return res.status(404).json({ error: "Tab not found in group" });
    } 

    let { note_content, note_bgColor } = req.body;
    // 将 note_content 的值转换为字符串，如果是数字则保持原样，如果是其他类型则转换为字符串
    note_content = String(note_content);

    if (group_id && item_id && note_content !== undefined && note_bgColor !== undefined) {
      tab.note_content = note_content;
      tab.note_bgColor = note_bgColor || "#ffffff";
        /** 
         * @openapi
         * components:
         *   requestBodies:
         *     updateTab:
         *       type: object
         *       properties:
         *         note_content:
         *           $ref: '#/components/schemas/Item/properties/note_content'
         *         note_bgColor:
         *           $ref: '#/components/schemas/Item/properties/note_bgColor'
         */
      db.write();
      res.status(201).json({ message: "Note added to tab successfully", note_content: tab.note_content, note_bgColor: tab.note_bgColor });
    } else {
      return res.status(400).json({ error: "Invalid request body" });
    }
};

exports.addNote = (req, res) => {
    const { group_id } = req.params;
    const group = db.get('groups').find({ id: group_id }).value();
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    } else if (!group.items) {
      group.items = [];
    } 

    const { note_content, note_bgColor } = req.body;
    if (group_id && note_content !== undefined && note_bgColor) {
      const newNote = {
        item_id: generateItemId(),
        item_type: 1, // Assuming 1 represents a note
        note_content,
        note_bgColor: note_bgColor || "#ffffff"
      };
      /**
       * @openapi
       * components:
       *   requestBodies:
       *     addNote:
       *       description: Create a note in group.
       *       type: object
       *       properties:
       *         note_content:
       *           type: string
       *         note_bgColor:
       *           type: string
       *       example:
       *         note_content: ''
       *         note_bgColor: '#ffffff'
       */
      group.items.push(newNote);
      db.write();
      res.status(201).json({ message: "Note added to group successfully", item_id: newNote.item_id });
    } else {
      return res.status(400).json({ error: "Invalid request body" });
    }
};

exports.updateNote = (req, res) => {
    const { group_id, item_id } = req.params;
    const groups = db.get('groups').value();
    const group = groups.find(group => group.id === group_id);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    const { item_type } = req.body;
    const noteIndex = group.items.findIndex(item => item.item_id === item_id && item.item_type === 1);
    if (noteIndex === -1) {
      return res.status(404).json({ error: "Note not found in group" });
    } 
    
    if (group && noteIndex !== undefined && item_type === 2) {
      group.items[noteIndex].item_type = 2;
      group.items[noteIndex].doneStatus = false;

      /**
       * @openapi
       * components:
       *   requestBodies:
       *     TabNoteChangetoTodo:
       *       description: Convert a tab to a todo.
       *       type: object
       *       properties:
       *         item_type:
       *           type: integer
       *           enum: [2]
       */ 
      db.write();
      res.status(200).json({ message: "Note changed to todo successfully", item_id });
    } else {
      return res.status(400).json({ error: "Invalid request body" });
    }
};

exports.updateTodo = (req, res) => {
    const { group_id, item_id } = req.params;
    const groups = db.get('groups').value();
    const group = groups.find(group => group.id === group_id);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }
    
    const { item_type, doneStatus } = req.body;
    const todoIndex = group.items.findIndex(item => item.item_id === item_id && item.item_type === 2);//NOTE item_type  req body string 也會給過(js問題)要用===
    if (todoIndex === -1) {
      return res.status(404).json({ error: "Todo not found in group" });
    } 
    
    if (group && todoIndex !== undefined && item_type === 1) {
      group.items[todoIndex].item_type = 1;
      delete group.items[todoIndex].doneStatus
       /**
       * @openapi
       * components:
       *   requestBodies:
       *     TodoChangetoNote:
       *       description: Convert a todo to a note in an existing group.
       *       type: object
       *       properties:
       *         item_type:
       *           type: integer
       *           enum: [1]
       */ 
      db.write();
      res.status(200).json({ message: "Todo changed to Note successfully" });
    } else if (group && todoIndex !== undefined && (doneStatus === true || doneStatus === false)) {
      group.items[todoIndex].doneStatus = doneStatus;
       /**
       * @openapi
       * components:
       *   requestBodies:
       *     TodoStatusUpdate:
       *       description: Check/uncheck a todo in an existing group.
       *       type: object
       *       properties:
       *         doneStatus:
       *           type: boolean
       */
      db.write();
      res.status(200).json({ message: "Todo status updated successfully", item_id });
    } else {
      return res.status(400).json({ error: "Invalid request body" });
    }
    // Update the todo's doneStatus
};
