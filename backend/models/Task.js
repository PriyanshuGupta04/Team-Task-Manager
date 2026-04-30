const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  title: String,
  description: String,
  status: { type: String, default: "todo", enum: ["todo", "in-progress", "done"] },
  priority: { type: String, default: "medium", enum: ["low", "medium", "high"] },
  dueDate: Date,
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Task", schema);