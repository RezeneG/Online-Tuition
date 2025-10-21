import express from "express";
import Course from "../models/Course.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

// GET all courses (public)
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single course (public)
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    course ? res.json(course) : res.status(404).json({ error: "Not found" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PROTECT ALL ROUTES BELOW WITH ADMIN MIDDLEWARE
router.use(protect);
router.use(admin);

// POST create new course (admin only)
router.post("/", async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.status(201).json(course);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update course (admin only)
router.put("/:id", async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(course);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE course (admin only)
router.delete("/:id", async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: "Course deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
