const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema(
  {
    contactId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    phone: {
      type: String,
      required: true,
      match: /^[0-9]{10}$/,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Contact", ContactSchema);