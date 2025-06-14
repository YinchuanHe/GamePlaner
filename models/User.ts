import { Schema, model, models } from 'mongoose';

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['super-admin', 'admin', 'member'],
    default: 'member',
  },
});

export default models.User || model('User', userSchema);
