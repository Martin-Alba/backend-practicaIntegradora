import mongoose from "mongoose";

const prodCollection = "products";

const prodSchema = mongoose.Schema({
  id: Number,
  title: String,
  description: String,
  price: Number,
  status: Boolean,
  code: String,
  stock: Number,
  category: String,
  thumbnail: [],
});

const prodModel = mongoose.model(prodCollection, prodSchema);

export default prodModel;
