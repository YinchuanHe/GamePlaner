import { Schema, model, models } from 'mongoose';

const userSchema = new Schema({
  username: { type: String },
  email: { type: String, required: true, unique: true },
  role: {
    type: String,
    enum: ['super-admin', 'admin', 'member'],
    default: 'member',
  },
  club: { type: Schema.Types.ObjectId, ref: 'Club' },
  image: { type: String },
});

export default models.User || model('User', userSchema);
