const mongoose = require("mongoose");

//connect to Database

const dbConnection = () => {
  mongoose
    .connect(process.env.DB_URI)
    .then((conn) => {
      console.log(`Database connected successfully on ${conn.connection.host}`);
    })
    .catch((err) => {
      console.log(`Error: ${err.message}`);
      process.exit(1);
    });
};

module.exports = dbConnection;
