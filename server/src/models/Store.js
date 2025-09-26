import mongoose from "mongoose";

const storeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  location: { type: String },
  contact: { type: String },
  foods: [{ type: mongoose.Schema.Types.ObjectId, ref: "FoodListing" }]
}, { timestamps: true });

export default mongoose.model("Store", storeSchema);
