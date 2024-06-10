const mongoose = require("mongoose");

const connection = mongoose.connect("mongodb://localhost:27017/moviestore", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

connection
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });

module.exports = connection;
