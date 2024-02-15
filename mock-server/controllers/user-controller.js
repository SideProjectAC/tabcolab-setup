const { v4: uuidv4 } = require("uuid");
const localRegisterValidation =
  require("../validation").localRegisterValidation;
const jsonServer = require("json-server");
const dbrouter = jsonServer.router("db.json");

exports.register = (req, res) => {
  const { error } = localRegisterValidation(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
  } else {
    const { username, email, password } = req.body;
    const newUser = {
      id: uuidv4(),
      username,
      email,
      password,
      createdAt: new Date().toLocaleDateString(),
    };

    const db = dbrouter.db; // 獲取低級別的數據庫實例
    const usersCollection = db.get("users"); // 獲取用戶集合
    const existingUser = usersCollection
      .find({ username: newUser.username })
      .value(); // 檢查用戶名是否已存在

    if (existingUser) {
      // 如果用戶名已存在，返回錯誤
      res.status(400).send("Username already exists");
    } else {
      // 否則，將新用戶存入數據庫
      usersCollection.insert(newUser).write();
      res.status(200).send("User registered successfully");
    }
  }
};
