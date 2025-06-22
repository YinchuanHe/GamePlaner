import { Schema, model, models } from 'mongoose';

const verificationTokenSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  token: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true },
});

export default models.VerificationToken || model('VerificationToken', verificationTokenSchema);
