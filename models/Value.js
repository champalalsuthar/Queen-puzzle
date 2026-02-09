const mongoose = require("mongoose");

const valueSchema = new mongoose.Schema({
  value: {
    type: Number,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active"
  }
});

module.exports = mongoose.model("Value", valueSchema);
