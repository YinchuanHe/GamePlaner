import { Schema, model, models } from "mongoose";

const userMetaSchema = new Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  name: { type: String },
});

export default models.UserMeta || model("UserMeta", userMetaSchema);
