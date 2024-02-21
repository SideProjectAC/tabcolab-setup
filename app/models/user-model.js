const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  email: String,
  password: String,
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
