import { Schema, model, models } from 'mongoose';

const eventSchema = new Schema({
  name: { type: String, required: true },
});

export default models.Event || model('Event', eventSchema);
