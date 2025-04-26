const EventModel = require("../models/eventModel");
const factory = require("./handlersFactory");

exports.createEvent = factory.createOne(EventModel);
exports.getAllEvents = factory.getAll(EventModel);
exports.getEvent = factory.getOne(EventModel);
exports.updateEvent = factory.updateOne(EventModel);
exports.deleteEvent = factory.deleteOne(EventModel);