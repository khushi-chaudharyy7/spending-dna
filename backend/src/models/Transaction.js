import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, default: 'Uncategorized' },
  date: { type: Date, required: true },
  type: { type: String, enum: ['debit', 'credit'], default: 'debit' },
  notes: { type: String },
  isAnomaly: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Transaction', transactionSchema);