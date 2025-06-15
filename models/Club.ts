import { Schema, model, models } from 'mongoose';

const clubSchema = new Schema({
  name: { type: String, required: true },
  description: String,
  location: String,
  createdBy: String,
  createdAt: { type: Date, default: Date.now },
  logoUrl: String,
  members: [
    {
      id: { type: Schema.Types.ObjectId, ref: 'User' },
      username: String,
    },
  ],
});

export default models.Club || model('Club', clubSchema);
