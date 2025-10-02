import express from "express";
import FoodListing from "../models/FoodListing.js";
import Store from "../models/Store.js";

const router = express.Router();

// Create a new food item
router.post("/", async (req, res) => {
  try {
    const { name, description, quantity, price, storeId } = req.body;

    // ensure store exists
    const store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json({ error: "Store not found" });
    }

    const food = new FoodListing({
      name,
      description,
      quantity,
      price,
      store: storeId,
    });

    const savedFood = await food.save();

    // push food into store
    store.foods.push(savedFood._id);
    await store.save();

    res.status(201).json(savedFood);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all food items
router.get("/", async (req, res) => {
  try {
    const foods = await FoodListing.find().populate("store");
    res.json(foods);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single food by ID
router.get("/:id", async (req, res) => {
  try {
    const food = await FoodListing.findById(req.params.id).populate("store");
    if (!food) return res.status(404).json({ error: "Food not found" });
    res.json(food);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a food
router.put("/:id", async (req, res) => {
  try {
    const updatedFood = await FoodListing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedFood) return res.status(404).json({ error: "Food not found" });
    res.json(updatedFood);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a food
router.delete("/:id", async (req, res) => {
  try {
    const deletedFood = await FoodListing.findByIdAndDelete(req.params.id);
    if (!deletedFood) return res.status(404).json({ error: "Food not found" });

    // also remove from store
    await Store.updateOne(
      { foods: deletedFood._id },
      { $pull: { foods: deletedFood._id } }
    );

    res.json({ message: "Food deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
