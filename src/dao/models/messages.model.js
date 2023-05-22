import mongoose from "mongoose";

const msgCollection = "messages";

const msgSchema = mongoose.Schema({
  user: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const msgModel = mongoose.model(msgCollection, msgSchema);

export default msgModel;
