const EventModel = require("../models/eventModel");
const factory = require("./handlersFactory");
const asyncHandler = require("express-async-handler");

exports.createEvent = factory.createOne(EventModel);
exports.getAllEvents = factory.getAll(EventModel);
exports.getEvent = factory.getOne(EventModel);
exports.updateEvent = factory.updateOne(EventModel);
exports.deleteEvent = factory.deleteOne(EventModel);

exports.getEventsByClub = asyncHandler(async (req, res, next) => {
  const { clubId } = req.params;

  // Fetch all events associated with the specified club
  const events = await EventModel.find({ club: clubId });

  res.status(200).json({
    status: "success",
    data: events,
  });
});

exports.getComingSoonEvents = asyncHandler(async (req, res, next) => {
  const currentDate = new Date();

  // Fetch all events with a date greater than the current date
  const comingSoonEvents = await EventModel.find({
    date: { $gt: currentDate },
  }).sort("date");

  res.status(200).json({
    status: "success",
    data: comingSoonEvents,
  });
});
