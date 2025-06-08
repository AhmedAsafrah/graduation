const RegistrationModel = require("../models/registrationModel");
const ClubModel = require("../models/clubModel");
const AppError = require("../utils/appError");
const factory = require("./handlersFactory");
const expressAsyncHandler = require("express-async-handler");
const { createNotification } = require("./notificationService");

exports.createRegistration = async (req, res, next) => {
  try {
    const { student, club } = req.body;

    // Check if the student already has a registration for this club
    const existingRegistration = await RegistrationModel.findOne({
      student,
      club,
    });

    // Block if status is "pending" or "approved"
    if (
      existingRegistration &&
      (existingRegistration.status === "pending" ||
        existingRegistration.status === "approved")
    ) {
      return next(
        new AppError("You have already registered for this club", 400)
      );
    }

    // If rejected, allow re-apply by updating status to "pending"
    if (
      existingRegistration &&
      existingRegistration.status === "rejected"
    ) {
      existingRegistration.status = "pending";
      await existingRegistration.save();
      return res.status(200).json({
        status: "success",
        data: {
          registration: existingRegistration,
        },
      });
    }

    // If the user is a club_responsible, ensure they aren't registering for their own club
    const user = req.user;
    if (
      user.role === "club_responsible" &&
      user.managedClub.toString() === club
    ) {
      return next(
        new AppError("You cannot register for a club you manage", 400)
      );
    }

    const registration = await RegistrationModel.create({
      student,
      club,
      status: "pending",
    });

    res.status(201).json({
      status: "success",
      data: {
        registration,
      },
    });
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};

exports.approveRegistration = async (req, res, next) => {
  try {
    const registrationId = req.params.id;
    const { status } = req.body;

    const registration = await RegistrationModel.findById(registrationId);
    if (!registration) {
      return next(new AppError("Registration not found", 404));
    }

    // Find the club associated with the registration
    const club = await ClubModel.findById(registration.club);
    if (!club) {
      return next(new AppError("Club not found", 404));
    }

    // Check if the logged-in user is the club admin or system_responsible
    const user = req.user;
    const isClubAdmin =
      user.role === "club_responsible" &&
      user.managedClub.toString() === registration.club.toString();
    const isSystemResponsible = user.role === "system_responsible";

    if (!isClubAdmin && !isSystemResponsible) {
      return next(
        new AppError("You are not authorized to approve this registration", 403)
      );
    }

    // Update the status
    registration.status = status;
    await registration.save();

    // If approved, add student to club's members array (avoid duplicates)
    if (status === "approved") {
      if (!club.members) {
        club.members = [];
      }
      const studentId = registration.student.toString();
      if (!club.members.map((id) => id.toString()).includes(studentId)) {
        club.members.push(registration.student);
        await club.save();
      }
    }

    // ---- Notify the user who joined the club ----
    try {
      await createNotification(registration.student, "club_approved", {
        message: `تم قبول طلبك للانضمام إلى نادي "${club.name}".`,
        club: club._id,
      });
    } catch (err) {
      console.error("Notification error:", err);
    }
    // --------------------------------------------

    res.status(200).json({
      status: "success",
      data: {
        registration,
      },
    });
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};

exports.rejectRegistration = async (req, res, next) => {
  try {
    const registrationId = req.params.id;

    const registration = await RegistrationModel.findById(registrationId);
    if (!registration) {
      return next(new AppError("Registration not found", 404));
    }

    // Find the club associated with the registration
    const club = await ClubModel.findById(registration.club);
    if (!club) {
      return next(new AppError("Club not found", 404));
    }

    // Check if the logged-in user is the club admin or system_responsible
    const user = req.user;
    const isClubAdmin =
      user.role === "club_responsible" &&
      user.managedClub.toString() === registration.club.toString();
    const isSystemResponsible = user.role === "system_responsible";

    if (!isClubAdmin && !isSystemResponsible) {
      return next(
        new AppError("You are not authorized to reject this registration", 403)
      );
    }

    // Update the status to rejected
    registration.status = "rejected";
    await registration.save();

    res.status(200).json({
      status: "success",
      data: {
        registration,
      },
    });
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};

exports.leaveClub = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const clubId = req.params.clubId;

    // Find the registration
    const registration = await RegistrationModel.findOne({
      student: userId,
      club: clubId,
      status: "approved",
    });

    if (!registration) {
      return next(new AppError("You are not a member of this club", 404));
    }

    // Remove user from club's members array
    const club = await ClubModel.findById(clubId);
    if (!club) {
      return next(new AppError("Club not found", 404));
    }
    club.members = club.members.filter(
      (memberId) => memberId.toString() !== userId.toString()
    );
    await club.save();

    // Delete the registration
    await RegistrationModel.findByIdAndDelete(registration._id);

    res.status(200).json({
      status: "success",
      message: "You have left the club",
    });
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};

exports.getAllRegistrations = expressAsyncHandler(async (req, res, next) => {
  const registrations = await RegistrationModel.find()
    .populate({ path: "club", select: "name" })
    .populate({ path: "student", select: "name email" });

  const filtered = registrations.filter((reg) => reg.student);

  res.status(200).json({
    status: "success",
    results: filtered.length,
    data: filtered,
  });
});

exports.getRegistrationsByClub = expressAsyncHandler(async (req, res, next) => {
  const clubId = req.params.clubId;

  const registrations = await RegistrationModel.find({ club: clubId })
    .populate({ path: "club", select: "name" })
    .populate({ path: "student", select: "name email" });

  res.status(200).json({
    status: "success",
    results: registrations.length,
    data: registrations,
  });
});
