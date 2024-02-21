//SECTION - 應該要在此定義好資料欄位格式驗證
//NOTE - 待討論
const { v4: uuidv4 } = require('uuid');
function generateGroupId() {
  return uuidv4();
}
function generateItemId() {
  return uuidv4();
}
//!SECTION