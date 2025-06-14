import { Schema, model, models } from 'mongoose';

const eventSchema = new Schema({
  name: { type: String, required: true },
  club: { type: Schema.Types.ObjectId, ref: 'Club' },
});

export default models.Event || model('Event', eventSchema);
