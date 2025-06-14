import { Schema, model, models } from 'mongoose';

const clubSchema = new Schema({
  name: { type: String, required: true },
});

export default models.Club || model('Club', clubSchema);
