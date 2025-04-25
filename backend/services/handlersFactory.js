const AppError = require("../utils/appError");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findById(id);
    if (!document) {
      return next(new AppError(`No document found with the id ${id}`, 404));
    }
    await document.deleteOne();
    res.status(204).send({
      status: "success",
      message: "Document deleted successfully",
    });
  });

exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!document) {
      return next(
        new AppError(`No document found with the id ${req.params.id}`, 404)
      );
    }
    res.status(200).json({
      status: "success",
      data: document,
    });
  });

exports.createOne = (Model) =>
  asyncHandler(async (req, res) => {
    const newDocument = await Model.create(req.body);
    res.status(201).json({
      status: "success",
      data: newDocument,
    });
  });

exports.getOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return next(new AppError(`Invalid ID format`, 400));
    }
    const document = await Model.findById(id);
    if (!document) {
      return next(new AppError(`No document found with the id ${id}`, 404));
    }
    res.status(200).json({
      status: "success",
      data: document,
    });
  });

exports.getAll = (Model) =>
  asyncHandler(async (req, res) => {
    const documents = await Model.find();
    res.status(200).json({
      status: "success",
      count: documents.length,
      data: documents,
    });
  });
