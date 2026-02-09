const mongoose = require("mongoose");

const boardSchema = new mongoose.Schema({
  gridSize: { type: Number, required: true },
  level: { type: Number, required: true },
  colors: Number,
  regions: [Number],
  solution: [Number]
});

boardSchema.index({ gridSize: 1, level: 1 }, { unique: true });

module.exports = mongoose.model("Board", boardSchema);