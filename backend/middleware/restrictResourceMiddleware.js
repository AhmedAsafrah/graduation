const asyncHandler = require("express-async-handler");
const AppError = require("../utils/appError");

// Middleware to restrict actions to the resource's owner (for club_responsible or the user themselves)
exports.restrictToResourceOwner = (Model, ownerField = "author") =>
  asyncHandler(async (req, res, next) => {
    const resource = await Model.findById(req.params.id);
    if (!resource) {
      return next(new AppError(`${Model.modelName} not found`, 404));
    }

    // Allow system_responsible to bypass this check
    if (req.user.role === "system_responsible") {
      return next();
    }

    // Check if the logged-in user is the resource's owner
    const ownerId = resource[ownerField]
      ? resource[ownerField].toString()
      : resource._id.toString();
    if (ownerId !== req.user.id) {
      return next(
        new AppError(
          `You can only perform this action on your own ${Model.modelName.toLowerCase()}`,
          403
        )
      );
    }

    next();
  });

// Middleware to restrict actions to the club's manager (for club_responsible)
exports.restrictToClubManager = (Model) =>
  asyncHandler(async (req, res, next) => {
    const club = await Model.findById(req.params.id);
    if (!club) {
      return next(new AppError(`${Model.modelName} not found`, 404));
    }

    // Allow system_responsible to bypass this check
    if (req.user.role === "system_responsible") {
      return next();
    }

    // For club_responsible, check if they manage this club
    if (req.user.role === "club_responsible") {
      if (!req.user.managedClub) {
        return next(
          new AppError("You are not assigned to manage any club", 403)
        );
      }
      if (req.user.managedClub.toString() !== req.params.id) {
        return next(
          new AppError("You can only update the club you manage", 403)
        );
      }
    }

    next();
  });
