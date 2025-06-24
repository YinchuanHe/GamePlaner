import mongoose from 'mongoose'
const { Schema, model, models } = mongoose

const pushSubscriptionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  subscription: { type: Schema.Types.Mixed, required: true },
})

export default models.PushSubscription || model('PushSubscription', pushSubscriptionSchema)
