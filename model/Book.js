const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  description: String,
  rating: { type: Number, min: 0, max: 5 },
  price: { type: Number },
});

module.exports = mongoose.model("Book", bookSchema);
