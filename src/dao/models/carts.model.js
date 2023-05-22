import mongoose from "mongoose";

const cartsCollection = "carts";

const cartsSchema = mongoose.Schema({
  id: Number,
  product: [
    {
      productId: Number,
      quantity: Number,
    },
  ],
});

const cartsModel = mongoose.model(cartsCollection, cartsSchema);

export default cartsModel;
