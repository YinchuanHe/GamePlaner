import { Schema, model, models } from 'mongoose';

const eventSchema = new Schema({
  name: { type: String, required: true },
  club: { type: Schema.Types.ObjectId, ref: 'Club' },
  participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

export default models.Event || model('Event', eventSchema);
