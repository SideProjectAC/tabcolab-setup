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

module.exports = {
  getGroup,
  validateTabRequestBody,
  createNewTab,
};
