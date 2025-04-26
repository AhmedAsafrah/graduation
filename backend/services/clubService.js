const ClubModel = require("../models/clubModel");

const factory = require("./handlersFactory");

exports.createClub = factory.createOne(ClubModel);

exports.updateClub = factory.updateOne(ClubModel);

exports.deleteClub = factory.deleteOne(ClubModel);

exports.getClub = factory.getOne(ClubModel);

exports.getAllClubs = factory.getAll(ClubModel);
