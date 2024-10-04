const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = async () => {
  mongoose
    .connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("Database connected successsfully"))
    .catch((error) => {
      console.log(error);
      console.log("DB connection failed");
    });
};
