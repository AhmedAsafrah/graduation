const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");

const clubRoute = require("./routes/clubRoute");
const userRoute = require("./routes/userRoute");
const eventRoute = require("./routes/eventRoute");
const postRoute = require("./routes/postRoute");
const commentRoute = require("./routes/commentRoute");
const registrationRoute = require("./routes/registrationRoute");
const likeRoute = require("./routes/likeRoute");
const authRoute = require("./routes/authRoute");
const leaderboardRoute = require("./routes/leaderboardRoute");

const AppError = require("./utils/appError");
const globalError = require("./middleware/globalErrorHandler");
dotenv.config();

const dbConnection = require("./config/database");

// Connect to Database
dbConnection();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

// Mounting Routes
app.use("/api/v1/clubs", clubRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/events", eventRoute);
app.use("/api/v1/posts", postRoute);
app.use("/api/v1/comments", commentRoute);
app.use("/api/v1/registrations", registrationRoute);
app.use("/api/v1/likes", likeRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/leaderboard", leaderboardRoute);

// Catch all wrong routes (using middleware)
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// Global Error Handling Middleware
app.use(globalError);

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log(`Unhandled Rejection Errors: ${err.name} | ${err.message}`);
  server.close(() => {
    console.log("Server closed _--_");
    process.exit(1);
  });
});
