import mongoose from 'mongoose';
const { Schema, model, models } = mongoose;

const matchSchema = new Schema({
  event: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
  round: Number,
  court: Number,
  teamA: [String],
  teamB: [String],
  teamAScore: Number,
  teamBScore: Number,
});

export default models.Match || model('Match', matchSchema);
