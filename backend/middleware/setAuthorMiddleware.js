const AppError = require("../utils/appError");

exports.setAuthor = (req, res, next) => {
  if (!req.user || !req.user.id) {
    return next(new AppError("User authentication required", 401));
  }

  const path = req.originalUrl.toLowerCase();
  if (path.includes("registrations")) {
    if (req.body.student) {
      return next(
        new AppError("Student field cannot be specified in the request", 400)
      );
    }
    req.body.student = req.user.id;
  } else {
    if (req.body.author) {
      return next(
        new AppError("Author field cannot be specified in the request", 400)
      );
    }
    req.body.author = req.user.id;
  }

  next();
};