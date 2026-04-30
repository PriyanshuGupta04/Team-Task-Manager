const router = require("express").Router();
const Task = require("../models/Task");
const authMiddleware = require("../middleware/auth");

// CREATE TASK
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description, projectId, assignedTo, priority, dueDate } = req.body;
    const task = await Task.create({
      title,
      description,
      projectId,
      assignedTo,
      priority,
      dueDate,
      createdBy: req.user.id
    }).populate("assignedTo createdBy", "name email");
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET ALL TASKS FOR USER
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { projectId, status, priority } = req.query;
    let query = { $or: [{ assignedTo: req.user.id }, { createdBy: req.user.id }] };
    if (projectId) query.projectId = projectId;
    if (status) query.status = status;
    if (priority) query.priority = priority;

    const tasks = await Task.find(query)
      .populate("assignedTo createdBy projectId", "name email title")
      .sort({ dueDate: 1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET TASK BY ID
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate("assignedTo createdBy projectId");
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE TASK
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    ).populate("assignedTo createdBy projectId");
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE TASK
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;