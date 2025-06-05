const asyncHandler = require("express-async-handler");
const RegistrationModel = require("../models/registrationModel");
const ClubModel = require("../models/clubModel");
const factory = require("./handlersFactory");
const { createNotification } = require("./notificationService");
const UserModel = require("../models/userModel");

exports.createClub = asyncHandler(async (req, res, next) => {
  const { name, description, college } = req.body;

  const profilePicture = req.files?.profilePicture
    ? req.files.profilePicture[0].path
    : undefined;

  const coverPicture = req.files?.coverPicture
    ? req.files.coverPicture[0].path
    : undefined;

  if (!profilePicture) {
    return next(new Error("Profile picture is required"));
  }
  if (!coverPicture) {
    return next(new Error("Cover picture is required"));
  }

  const club = await ClubModel.create({
    name,
    description,
    college,
    profilePicture,
    coverPicture,
  });

  // ---- Notification logic added here ----
  try {
    const users = await UserModel.find({}, "_id");
    const notifications = users.map((user) => {
      return createNotification(user._id, "club_created", {
        message: `تم إنشاء نادي جديد "${club.name}"!`,
      });
    });
    await Promise.all(notifications);
  } catch (err) {
    console.error("Notification error:", err);
  }
  // ---------------------------------------

  res.status(201).json({
    status: "success",
    data: club,
  });
});
exports.updateClub = asyncHandler(async (req, res, next) => {
  const { name, description, college } = req.body;

  // Fetch the existing club to get old image URLs
  const club = await ClubModel.findById(req.params.id);
  if (!club) {
    return next(new Error("No club found with that ID"));
  }

  // Prepare the update data
  const updateData = { name, description, college };

  // Handle file uploads if present
  if (req.files) {
    // Function to extract public_id from Cloudinary URL
    const getPublicIdFromUrl = (url) => {
      if (!url) return null;
      const parts = url.split("/");
      const fileName = parts[parts.length - 1].split(".")[0];
      const folder = parts[parts.length - 2];
      return `${folder}/${fileName}`;
    };

    // Delete old profilePicture and upload new one
    if (req.files.profilePicture && club.profilePicture) {
      const oldProfilePublicId = getPublicIdFromUrl(club.profilePicture);
      if (oldProfilePublicId) {
        try {
          await cloudinary.uploader.destroy(oldProfilePublicId);
        } catch (error) {}
      }
      updateData.profilePicture = req.files.profilePicture[0].path;
      const newProfilePublicId = getPublicIdFromUrl(
        req.files.profilePicture[0].path
      );
      if (newProfilePublicId) {
        try {
          await cloudinary.api.resource(newProfilePublicId, {
            invalidate: true,
          });
        } catch (error) {}
      }
    }

    // Delete old coverPicture and upload new one
    if (req.files.coverPicture && club.coverPicture) {
      const oldCoverPublicId = getPublicIdFromUrl(club.coverPicture);
      if (oldCoverPublicId) {
        try {
          await cloudinary.uploader.destroy(oldCoverPublicId);
        } catch (error) {}
      }
      updateData.coverPicture = req.files.coverPicture[0].path;
      const newCoverPublicId = getPublicIdFromUrl(
        req.files.coverPicture[0].path
      );
      if (newCoverPublicId) {
        try {
          await cloudinary.api.resource(newCoverPublicId, { invalidate: true });
        } catch (error) {}
      }
    }
  }

  // Update the club with new data
  const updatedClub = await ClubModel.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true, runValidators: true }
  );

  res.status(201).json({
    status: "success",
    data: updatedClub,
  });
});
exports.deleteClub = factory.deleteOne(ClubModel);

exports.getClub = factory.getOne(ClubModel);

exports.getAllClubs = asyncHandler(async (req, res, next) => {
  const clubs = await ClubModel.find().populate({
    path: "members",
    select: "name email",
  });
  res.status(200).json({
    status: "success",
    results: clubs.length,
    data: clubs,
  });
});

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
    count: notJoinedClubs.length,
    status: "success",
    data: notJoinedClubs,
  });
});

exports.getClubMembers = asyncHandler(async (req, res, next) => {
  const { clubId } = req.params;

  // Find the club and populate members' info
  const club = await ClubModel.findById(clubId).populate({
    path: "members",
    select: "_id name email profilePicture",
  });

  if (!club) {
    return res.status(404).json({
      status: "fail",
      message: "Club not found",
    });
  }

  res.status(200).json({
    status: "success",
    count: club.members.length,
    data: club.members,
  });
});

exports.getPendingRequests = asyncHandler(async (req, res, next) => {
  const { clubId } = req.params;

  // Find all pending registrations for the club and populate student info
  const pendingRegistrations = await RegistrationModel.find({
    club: clubId,
    status: "pending",
  }).populate({
    path: "student",
    select: "_id name email profilePicture",
  });

  // Extract student objects (filter out any nulls)
  const students = pendingRegistrations
    .map((reg) => reg.student)
    .filter((student) => student);

  res.status(200).json({
    status: "success",
    count: students.length,
    data: students,
  });
});
