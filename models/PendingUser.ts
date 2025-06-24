import mongoose from 'mongoose';
const { Schema, model, models } = mongoose;

const pendingUserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  token: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});

export default models.PendingUser || model('PendingUser', pendingUserSchema);
