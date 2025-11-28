const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    trim: true,
    min: 5,
    max: 20,
    required: true,
    unique: true
  },
  email: {
    type: String,
    min: 3,
    max: 20
  },
  password: {
    type: String,
    min: 4,
    required: true,
  },
  role: {
    type: String,
    enum: ["buyer", "seller"],
    required: true
  },

  cart: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product"
    }
  ],

  wishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
});

const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;
