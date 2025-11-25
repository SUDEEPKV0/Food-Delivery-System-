import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  userId: String,
  items: [
    {
      productId: String,
      quantity: Number,
      price: Number
    }
  ],
  cartTotal: Number
});

export default mongoose.model("Cart", cartSchema);
