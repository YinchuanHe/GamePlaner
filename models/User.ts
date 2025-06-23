import mongoose from 'mongoose';
const { Schema, model, models } = mongoose;

export interface IUser {
  username?: string;
  email: string;
  gender?: string;
  nickname?: string;
  wechatId?: string;
  role?: 'super-admin' | 'admin' | 'member';
  clubs?: string[];
  image?: string;
  password?: string;
  level?: number;
  pushSubscriptions?: {
    endpoint: string;
    keys: { p256dh: string; auth: string };
  }[];
}

const userSchema = new Schema({
  username: { type: String },
  email: { type: String, required: true, unique: true },
  gender: { type: String },
  nickname: { type: String },
  wechatId: { type: String },
  role: {
    type: String,
    enum: ['super-admin', 'admin', 'member'],
    default: 'member',
  },
  clubs: [{ type: Schema.Types.ObjectId, ref: 'Club' }],
  image: { type: String },
  password: { type: String },
  level: { type: Number },
  pushSubscriptions: [
    {
      endpoint: String,
      keys: {
        p256dh: String,
        auth: String,
      },
    },
  ],
});

export default models.User || model('User', userSchema);
