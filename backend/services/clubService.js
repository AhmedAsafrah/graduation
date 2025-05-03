const asyncHandler = require("express-async-handler");
const RegistrationModel = require("../models/registrationModel");
const ClubModel = require("../models/clubModel");
const factory = require("./handlersFactory");

exports.createClub = factory.createOne(ClubModel);

exports.updateClub = factory.updateOne(ClubModel);

exports.deleteClub = factory.deleteOne(ClubModel);

exports.getClub = factory.getOne(ClubModel);

exports.getAllClubs = factory.getAll(ClubModel);

exports.getUnregisteredClubs = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  // Find clubs the user has already registered for
  const registeredClubs = await RegistrationModel.find({
    student: userId,
  }).select("club");

  // Extract club IDs
  const registeredClubIds = registeredClubs.map(
    (registration) => registration.club
  );

  // Find 5 clubs the user has not registered for
  const unregisteredClubs = await ClubModel.find({
    _id: { $nin: registeredClubIds },
  })
    .limit(5)
    .exec();

  res.status(200).json({
    status: "success",
    data: unregisteredClubs,
  });
});

exports.getJoinedClubs = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const approvedRegistrations = await RegistrationModel.find({
    student: userId,
    status: "approved",
  }).select("club");
  const joinedClubIds = approvedRegistrations.map(
    (registration) => registration.club
  );
  const joinedClubs = await ClubModel.find({
    _id: { $in: joinedClubIds },
  });
  res.status(200).json({
    status: "success",
    data: joinedClubs,
  });
});

exports.getNotJoinedClubs = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const approvedRegistrations = await RegistrationModel.find({
    student: userId,
    status: "approved",
  }).select("club");
  const joinedClubIds = approvedRegistrations.map(
    (registration) => registration.club
  );
  const notJoinedClubs = await ClubModel.find({
    _id: { $nin: joinedClubIds },
  });
  res.status(200).json({
    count : notJoinedClubs.length,
    status: "success",
    data: notJoinedClubs,
  });
});

