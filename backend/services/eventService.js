const EventModel = require("../models/eventModel");
const factory = require("./handlersFactory");
const asyncHandler = require("express-async-handler");

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
      populate: { path: "author", select: "name email" }
    });

  // Map comments to include author info in a 'description' field
  const eventsWithCommentDescriptions = events.map(event => {
    const eventObj = event.toObject();
    eventObj.comments = eventObj.comments.map(comment => {
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
    // Function to extract public_id from Cloudinary URL
    const getPublicIdFromUrl = (url) => {
      if (!url) return null;
      const parts = url.split("/");
      const fileName = parts[parts.length - 1].split(".")[0];
      const folder = parts[parts.length - 2];
      return `${folder}/${fileName}`;
    };

    // Delete old image and upload new one
    if (req.files.image && event.image) {
      const oldImagePublicId = getPublicIdFromUrl(event.image);
      if (oldImagePublicId) {
        try {
          await cloudinary.uploader.destroy(oldImagePublicId);
        } catch (error) {}
      }
      updateData.image = req.files.image[0].path;
      const newImagePublicId = getPublicIdFromUrl(req.files.image[0].path);
      if (newImagePublicId) {
        try {
          await cloudinary.api.resource(newImagePublicId, { invalidate: true });
        } catch (error) {}
      }
    }
  }

  // Update the event with new data
  const updatedEvent = await EventModel.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true, runValidators: true }
  );

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
