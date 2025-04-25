const PostModel = require("../models/postModel");

const factory = require("./handlersFactory");

exports.createPost = factory.createOne(PostModel);

exports.updatePost = factory.updateOne(PostModel);

exports.deletePost = factory.deleteOne(PostModel);

exports.getPost = factory.getOne(PostModel);

exports.getAllPosts = factory.getAll(PostModel);
