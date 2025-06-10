const RegistrationModel = require("../models/registrationModel");
const ClubModel = require("../models/clubModel");
const AppError = require("../utils/appError");
const factory = require("./handlersFactory");
const expressAsyncHandler = require("express-async-handler");
const { createNotification } = require("./notificationService");

exports.createRegistration = async (req, res, next) => {
  try {
    const { student, club } = req.body;

    const existingRegistration = await RegistrationModel.findOne({
      student,
      club,
    });

    if (
      existingRegistration &&
      (existingRegistration.status === "pending" ||
        existingRegistration.status === "approved")
    ) {
      return next(
        new AppError("You have already registered for this club", 400)
      );
    }

    if (existingRegistration && existingRegistration.status === "rejected") {
      existingRegistration.status = "pending";
      await existingRegistration.save();
      return res.status(200).json({
        status: "success",
        data: {
          registration: existingRegistration,
        },
      });
    }

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

    const club = await ClubModel.findById(registration.club);
    if (!club) {
      return next(new AppError("Club not found", 404));
    }

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

    registration.status = status;
    await registration.save();

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

    const club = await ClubModel.findById(registration.club);
    if (!club) {
      return next(new AppError("Club not found", 404));
    }

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

    const registration = await RegistrationModel.findOne({
      student: userId,
      club: clubId,
      status: "approved",
    });

    if (!registration) {
      return next(new AppError("You are not a member of this club", 404));
    }

    const club = await ClubModel.findById(clubId);
    if (!club) {
      return next(new AppError("Club not found", 404));
    }
    club.members = club.members.filter(
      (memberId) => memberId.toString() !== userId.toString()
    );
    await club.save();

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
