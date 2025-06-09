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

  // Upload all images to Cloudinary and collect their URLs
  let images = [];
  if (req.files && req.files.length > 0) {
    images = await Promise.all(
      req.files.map(async (file) => {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "events",
        });
        return result.secure_url;
      })
    );
  }

  const event = await EventModel.create({
    title,
    description,
    date,
    startTime,
    endTime,
    location,
    images, // array of Cloudinary URLs
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
    .sort({ date: -1, createdAt: -1 }) // Sort by date descending, then by creation time descending
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

  // Fetch the existing event to get the old image URLs
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

  // Helper to extract public_id from Cloudinary URL
  const getPublicIdFromUrl = (url) => {
    if (!url) return null;
    const parts = url.split("/");
    const fileName = parts[parts.length - 1].split(".")[0];
    const folder = parts[parts.length - 2];
    return `${folder}/${fileName}`;
  };

  // Remove all images if requested
  if (req.body.images === "") {
    if (event.images && event.images.length > 0) {
      for (const url of event.images) {
        const oldImagePublicId = getPublicIdFromUrl(url);
        if (oldImagePublicId) {
          try {
            await cloudinary.uploader.destroy(oldImagePublicId);
          } catch (error) {}
        }
      }
    }
    updateData.images = [];
  }

  // Handle new image uploads (replace all images)
  if (req.files && req.files.length > 0) {
    // Optionally: remove old images first (if not already removed above)
    if (!req.body.images || req.body.images !== "") {
      if (event.images && event.images.length > 0) {
        for (const url of event.images) {
          const oldImagePublicId = getPublicIdFromUrl(url);
          if (oldImagePublicId) {
            try {
              await cloudinary.uploader.destroy(oldImagePublicId);
            } catch (error) {}
          }
        }
      }
    }
    const newImages = await Promise.all(
      req.files.map(async (file) => {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "events",
        });
        return result.secure_url;
      })
    );
    updateData.images = newImages;
  }

  // Update the event with new data
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
