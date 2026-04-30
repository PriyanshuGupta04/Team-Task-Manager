const router = require("express").Router();
const Project = require("../models/Project");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");

// CREATE PROJECT
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, description } = req.body;
    const project = await Project.create({
      name,
      description,
      owner: req.user.id,
      members: [req.user.id]
    }).populate("owner members", "name email");
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET USER'S PROJECTS
router.get("/", authMiddleware, async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [{ owner: req.user.id }, { members: req.user.id }]
    }).populate("owner members", "name email");
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET PROJECT BY ID
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate("owner members", "name email");
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE PROJECT
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized" });
    }
    const updated = await Project.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    ).populate("owner members", "name email");
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADD MEMBER TO PROJECT
router.post("/:id/members", authMiddleware, async (req, res) => {
  try {
    const { email } = req.body;
    const project = await Project.findById(req.params.id);
    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    if (!project.members.includes(user._id)) {
      project.members.push(user._id);
      await project.save();
    }
    const updated = await project.populate("owner members", "name email");
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// REMOVE MEMBER FROM PROJECT
router.delete("/:id/members/:userId", authMiddleware, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized" });
    }
    project.members = project.members.filter(m => m.toString() !== req.params.userId);
    await project.save();
    const updated = await project.populate("owner members", "name email");
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE PROJECT
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized" });
    }
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: "Project deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
