import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({
  name: String,
  category: String,
  rating: Number,
  deliveryTime: String,
  location: String,
  isOpen: Boolean
});

export default mongoose.model("Restaurant", restaurantSchema);
