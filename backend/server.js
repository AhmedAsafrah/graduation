const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");

dotenv.config();

const dbConnection = require("./config/database");
// const studentRoute = require("./routes/studentRoute");


//connect to Database
dbConnection();


const app = express();

//middleware
app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`); 
}

// Mounting Routes
// app.use("/api/students", studentRoute);


const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
