const mongoose = require('mongoose');

const BreakdownSchema = new mongoose.Schema({
  name: String,
  percent: Number
}, { _id: false });

const ScanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  dish: { type: String, required: true },
  calories: { type: Number, default: 0 },
  protein: { type: Number, default: 0 },
  fat: { type: Number, default: 0 },
  carbs: { type: Number, default: 0 },
  healthScore: { type: Number, default: 0 },
  tip: { type: String },
  waterSuggestion: { type: String },
  breakdown: [BreakdownSchema],
  sourceFile: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Scan', ScanSchema);
