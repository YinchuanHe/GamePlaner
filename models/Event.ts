import { Schema, model, models } from 'mongoose';

const eventSchema = new Schema(
  {
    name: { type: String, required: true },
    club: { type: Schema.Types.ObjectId, ref: 'Club' },
    participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    status: {
      type: String,
      enum: ['preparing', 'on-going', 'ended'],
      default: 'preparing',
    },
    visibility: {
      type: String,
      enum: ['private', 'public-view', 'public-join'],
      default: 'private',
    },
  },
  { timestamps: true },
);

export default models.Event || model('Event', eventSchema);
