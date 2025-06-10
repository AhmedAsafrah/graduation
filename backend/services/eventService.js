const EventModel = require("../models/eventModel");
const factory = require("./handlersFactory");
const asyncHandler = require("express-async-handler");
const { createNotification } = require("./notificationService");
const userModel = require("../models/userModel");
const cloudinary = require("../utils/cloudinaryConfig");

exports.createEvent = asyncHandler(async (req, res, next) => {
  const {
    title,
    description,
    date,
    startTime,
    endTime,
    location,
    club,
    author,
  } = req.body;

  let image = "";
  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "events",
    });
    image = result.secure_url;
  }

  const event = await EventModel.create({
    title,
    description,
    date,
    startTime,
    endTime,
    location,
    image,
    club,
    author,
  });

  // ---- Notification logic ----
  try {
    const users = await userModel.find({}, "_id");
    const notifications = users.map((user) =>
      createNotification(user._id, "event_created", {
        message: `تم إنشاء فعالية جديدة "${event.title}"!`,
      })
    );
    await Promise.all(notifications);
  } catch (err) {
    console.error("Notification error:", err);
  }

  res.status(201).json({
    status: "success",
    data: event,
  });
});

exports.getAllEvents = asyncHandler(async (req, res, next) => {
  const events = await EventModel.find()
    .sort({ date: -1, createdAt: -1 })
    .populate("club", "name description")
    .populate("author", "name email")
    .populate({
      path: "comments",
      select: "content author createdAt",
      populate: { path: "author", select: "name email" },
    });

  const eventsWithCommentDescriptions = events.map((event) => {
    const eventObj = event.toObject();
    eventObj.comments = eventObj.comments.map((comment) => {
      return {
        ...comment,
        description: comment.author
          ? `${comment.author.name} (${comment.author.email})`
          : null,
      };
    });
    return eventObj;
  });

  res.status(200).json({
    status: "success",
    data: eventsWithCommentDescriptions,
  });
});

exports.getEvent = asyncHandler(async (req, res, next) => {
  const event = await EventModel.findById(req.params.id)
    .populate("club", "name description")
    .populate("author", "name email");

  if (!event) {
    return next(new Error("No event found with that ID"));
  }

  res.status(200).json({
    status: "success",
    data: event,
  });
});

exports.updateEvent = asyncHandler(async (req, res, next) => {
  const {
    title,
    description,
    date,
    startTime,
    endTime,
    location,
    club,
    author,
  } = req.body;

  const event = await EventModel.findById(req.params.id);
  if (!event) {
    return next(new Error("No event found with that ID"));
  }

  const updateData = {
    title,
    description,
    date,
    startTime,
    endTime,
    location,
    club,
    author,
  };

  const getPublicIdFromUrl = (url) => {
    if (!url) return null;
    const parts = url.split("/");
    const fileName = parts[parts.length - 1].split(".")[0];
    const folder = parts[parts.length - 2];
    return `${folder}/${fileName}`;
  };

  if (req.body.image === "") {
    if (event.image) {
      const oldImagePublicId = getPublicIdFromUrl(event.image);
      if (oldImagePublicId) {
        try {
          await cloudinary.uploader.destroy(oldImagePublicId);
        } catch (error) {}
      }
    }
    updateData.image = "";
  }

  if (req.file) {
    if (event.image) {
      const oldImagePublicId = getPublicIdFromUrl(event.image);
      if (oldImagePublicId) {
        try {
          await cloudinary.uploader.destroy(oldImagePublicId);
        } catch (error) {}
      }
    }
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "events",
    });
    updateData.image = result.secure_url;
  }

  const updatedEvent = await EventModel.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true, runValidators: true }
  );

  // ---- Notification logic ----
  try {
    const users = await userModel.find({}, "_id");
    const notifications = users.map((user) =>
      createNotification(user._id, "event_updated", {
        message: `The event "${updatedEvent.title}" has been updated.`,
      })
    );
    await Promise.all(notifications);
  } catch (err) {
    console.error("Notification error:", err);
  }

  res.status(200).json({
    status: "success",
    data: updatedEvent,
  });
});

exports.deleteEvent = factory.deleteOne(EventModel);

exports.getEventsByClub = asyncHandler(async (req, res, next) => {
  const { clubId } = req.params;

  const events = await EventModel.find({ club: clubId }).populate(
    "author",
    "name email"
  );

  res.status(200).json({
    status: "success",
    data: events,
  });
});

exports.getComingSoonEvents = asyncHandler(async (req, res, next) => {
  const currentDate = new Date();

  const comingSoonEvents = await EventModel.find({
    date: { $gt: currentDate },
  })
    .sort("date")
    .populate("club", "name description")
    .populate("author", "name email");

  res.status(200).json({
    status: "success",
    data: comingSoonEvents,
  });
});

exports.getEventEngagement = asyncHandler(async (req, res, next) => {
  const event = await EventModel.findById(req.params.id);

  if (!event) {
    return next(new Error("No event found with that ID"));
  }

  const numLikes = event.likes ? event.likes.length : 0;

  const comments = await EventModel.populate(event, {
    path: "comments",
    options: { sort: { createdAt: -1 } },
    populate: { path: "author", select: "name email profilePicture" },
  });

  res.status(200).json({
    status: "success",
    data: {
      eventId: req.params.id,
      likes: numLikes,
      commentsCount: comments.comments ? comments.comments.length : 0,
      comments: comments.comments || [],
    },
  });
});