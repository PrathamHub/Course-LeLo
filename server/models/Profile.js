const mongoose = require("mongoose");
const profileSchemaSchema = new mongoose.Schema({
  gender: {
    type: String,
  },
  dob: {
    type: String,
  },
  about: {
    type: String,
    trim: true,
  },
  contactNumber: {
    type: Number,
    trim: true,
  },
});
module.exports = mongoose.model("Profile", profileSchemaSchema);
