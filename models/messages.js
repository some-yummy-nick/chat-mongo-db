const mongoose = require("mongoose");

const Messages = new mongoose.Schema({
  name: {
    type: String
  },
  message: {
    type: String
  }
});

module.exports = mongoose.model("messages", Messages);
