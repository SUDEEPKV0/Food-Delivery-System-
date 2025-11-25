const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  items: { type: Array, default: [] },
  total: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  meta: { type: Object, default: {} }
});

module.exports = mongoose.models.Order || mongoose.model('Order', OrderSchema);
