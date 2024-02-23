const jsonServer = require("json-server");
const db = jsonServer.router("./mock-server/db.json").db;
const { generateItemId } = require("./generateId");

const getGroup = async (group_id) => {
  const group = await db.get("groups").find({ id: group_id }).value();
  if (!group) {
    throw new Error("Group not found");
  }
  return group;
};

const getTab = (group, item_id) => {
  return group.items.find(
    (item) => item.item_id === item_id && item.item_type === 0
  );
};

const validateTabRequestBody = (body) => {
  const {
    browserTab_favIconURL,
    browserTab_title,
    browserTab_url,
    targetItem_position,
  } = body;
  if (
    browserTab_favIconURL &&
    browserTab_title &&
    browserTab_url &&
    targetItem_position != undefined
  ) {
    return true;
  }
  return false;
};

const createNewTab = (body) => {
  const { browserTab_favIconURL, browserTab_title, browserTab_url } = body;
  return {
    item_id: generateItemId(),
    item_type: 0, // Assuming 0 represents a tab
    browserTab_favIconURL,
    browserTab_title,
    browserTab_url,
  };
};

const createNote = (note_content, note_bgColor) => {
  return {
    item_id: generateItemId(),
    item_type: 1, // Assuming 1 represents a note
    note_content,
    note_bgColor: note_bgColor || "#ffffff",
  };
};

module.exports = {
  getGroup,
  validateTabRequestBody,
  createNewTab,
  getTab,
  createNote,
};
