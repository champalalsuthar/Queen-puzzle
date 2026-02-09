const mongoose = require("mongoose");

const valueLevelSchema = new mongoose.Schema({
  value: { type: Number, required: true },
  level: { type: Number, required: true },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active"
  }
});

valueLevelSchema.index({ value: 1, level: 1 }, { unique: true });

module.exports = mongoose.model("ValueLevel", valueLevelSchema);
