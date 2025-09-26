import mongoose from "mongoose";

const foodListingSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
  store: { type: mongoose.Schema.Types.ObjectId, ref: "Store" }, // relation to Store
}, { timestamps: true });

export default mongoose.model("FoodListing", foodListingSchema);
