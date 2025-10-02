import express from "express";
import Store from "../models/Store.js";

const router = express.Router();

// Create a new store
router.post("/", async (req, res) => {
  try {
    const { name, location, contact } = req.body;
    const store = new Store({ name, location, contact });
    const savedStore = await store.save();
    res.status(201).json(savedStore);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all stores with their foods
router.get("/", async (req, res) => {
  try {
    const stores = await Store.find().populate("foods");
    res.json(stores);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single store by ID with its foods
router.get("/:id", async (req, res) => {
  try {
    const store = await Store.findById(req.params.id).populate("foods");
    if (!store) return res.status(404).json({ error: "Store not found" });
    res.json(store);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update store
router.put("/:id", async (req, res) => {
  try {
    const updatedStore = await Store.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedStore)
      return res.status(404).json({ error: "Store not found" });
    res.json(updatedStore);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete store
router.delete("/:id", async (req, res) => {
  try {
    const deletedStore = await Store.findByIdAndDelete(req.params.id);
    if (!deletedStore)
      return res.status(404).json({ error: "Store not found" });
    res.json({ message: "Store deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
