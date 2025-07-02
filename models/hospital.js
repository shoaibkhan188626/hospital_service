import mongoose from "mongoose";

const hospitalSchema = new mongoose.Schema({
  externalId: {
    type: String,
    unique: true,
    required: true,
    default: () => new mongoose.Types.ObjectId().toString(),
  },

  name: {
    type: String,
    required: true,
    maxLength: 200,
    trim: true,
  },

  address: {
    street: { type: String, maxLength: 200, trim: true },
    city: { type: String, maxLength: 100, trim: true },
    state: { type: String, maxLength: 200, trim: true },
    pincode: {
      type: String,
      match: /^\d{6}$/,
    },
  },

  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number],
      index: "2dsphere",
    },
  },

  contact: {
    phone: {
      type: String,
      match: /^[6-9]\d{9}$/,
      trim: true,
    },
    email: {
      type: String,
      match: /.+@.+\..+/,
      trim: true,
    },
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },

  deleted: {
    type: Boolean,
    default: false,
  },
});

hospitalSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model("Hospital", hospitalSchema);
