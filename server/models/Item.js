const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  tags: { type: [String], default: [] },
  cuisine: { type: String, default: '' },
  image: { type: String, default: '' },
  location: { lat: Number, lng: Number }
});

ItemSchema.index({ name: 'text', cuisine: 'text', tags: 'text' });

module.exports = mongoose.models.Item || mongoose.model('Item', ItemSchema);
