const EventModel = require("../models/eventModel");
const factory = require("./handlersFactory");
const asyncHandler = require("express-async-handler");
const { createNotification } = require("./notificationService");
const userModel = require("../models/userModel");

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

  const image = req.files?.image ? req.files.image[0].path : undefined;

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

  // ---- Notification logic added here ----
  try {
    const users = await userModel.find({}, "_id");
    const notifications = users.map((user) =>
      createNotification(user._id, "event_created", {
        message: `A new event "${event.title}" was created!`,
      })
    );
    await Promise.all(notifications);
  } catch (err) {
    console.error("Notification error:", err);
  }
  // ---------------------------------------

  res.status(201).json({
    status: "success",
    data: event,
  });
});

exports.getAllEvents = asyncHandler(async (req, res, next) => {
  const events = await EventModel.find()
    .populate("club", "name description")
    .populate("author", "name email")
    .populate({
      path: "comments",
      select: "content author createdAt",
      populate: { path: "author", select: "name email" },
    });

  // Map comments to include author info in a 'description' field
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
    .populate("club", "name description") // Populate club with specific fields
    .populate("author", "name email"); // Populate author with specific fields

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

  // Fetch the existing event to get the old image URL
  const event = await EventModel.findById(req.params.id);
  if (!event) {
    return next(new Error("No event found with that ID"));
  }

  // Prepare the update data
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

  // Handle image upload if present
  if (req.files) {
    // ...existing image handling code...
  }

  // Update the event with new data
  const updatedEvent = await EventModel.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true, runValidators: true }
  );

  // ---- Notification logic added here ----
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
  // ---------------------------------------

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
  ); // Populate author with specific fields

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
    .populate("club", "name description") // Populate club with specific fields
    .populate("author", "name email"); // Populate author with specific fields

  res.status(200).json({
    status: "success",
    data: comingSoonEvents,
  });
});
