const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: "member", enum: ["admin", "member"] },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", schema);