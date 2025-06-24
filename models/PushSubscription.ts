import mongoose from 'mongoose';
const { Schema, model, models } = mongoose;

const pushSubscriptionSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    endpoint: { type: String, required: true, unique: true },
    keys: {
      p256dh: { type: String },
      auth: { type: String },
    },
  },
  { timestamps: true }
);

export default models.PushSubscription || model('PushSubscription', pushSubscriptionSchema);
