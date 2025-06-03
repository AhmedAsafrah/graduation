const express = require("express");
const router = express.Router();

const authService = require("../services/authService");
const EventModel = require("../models/eventModel");
const { createComment } = require("../services/commentService");
const {
  restrictToResourceOwner,
} = require("../middleware/restrictResourceMiddleware");
const { setAuthor } = require("../middleware/setAuthorMiddleware");
const { createCommentValidator } = require("../validators/commentValidator");
const { protect, allowedTo } = authService;
const CommentModel = require("../models/commentModel");
const { createNotification } = require("../services/notificationService");
const LikeModel = require("../models/likeModel");

const {
  createEvent,
  getAllEvents,
  getEvent,
  updateEvent,
  deleteEvent,
  getEventsByClub,
  getComingSoonEvents,
} = require("../services/eventService");

const {
  createEventValidator,
  getSpecificEventValidator,
  updateEventValidator,
  deleteEventValidator,
  getEventsByClubValidator,
} = require("../validators/eventValidator");

const upload = require("../utils/multerConfig");
const setUploadFolder = require("../middleware/setUploadFolderMiddleware");

///////////////////////////////////////////////////// ******* ROUTES ******* /////////////////////////////////////////////////////

router.get(
  "/coming-soon",
  protect,
  allowedTo("student", "club_responsible", "system_responsible"),
  getComingSoonEvents
);

router.post(
  "/",
  protect,
  allowedTo("club_responsible", "system_responsible"),
  setUploadFolder("events"),
  upload.fields([{ name: "image", maxCount: 1 }]),
  setAuthor,
  createEventValidator,
  createEvent
); /** */

router.get("/", getAllEvents);

router.get("/:id", getSpecificEventValidator, getEvent);

router.post(
  "/:id/comments",
  protect,
  allowedTo("student", "club_responsible", "system_responsible"),
  setAuthor,
  createCommentValidator,
  async (req, res) => {
    try {
      const event = await EventModel.findById(req.params.id);
      if (!event) {
        return res.status(404).json({
          status: "fail",
          message: "Event not found",
        });
      }

      // Set comment fields
      req.body.role = "event";
      req.body.event = req.params.id;
      req.body.post = null;

      const comment = await createComment(req.body);
      event.comments.push(comment._id);
      await event.save();

      // Get all likes for this event from LikeModel
      const likes = await LikeModel.find({ targetType: "event", targetId: event._id }).populate("user", "name");
      const commenterName = req.user.name;

      // Send notification to all users who liked the event (and have a valid user)
      const notifications = likes
        .filter(like => like.user) // Only if user exists
        .map(like =>
          createNotification(like.user._id, "event_commented", {
            message: `${commenterName} commented on an event you liked: "${event.title}"`,
          })
        );
      await Promise.all(notifications);

      // Populate author and event fields
      const populatedComment = await CommentModel.findById(comment._id)
        .populate("author", "name email")
        .populate("event", "title date");

      res.status(201).json({
        status: "success",
        data: {
          comment: populatedComment,
        },
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }
);

router.put(
  "/:id",
  protect,
  allowedTo("club_responsible", "system_responsible"),
  restrictToResourceOwner(EventModel, "author"),
  setUploadFolder("events"),
  upload.fields([{ name: "image", maxCount: 1 }]),
  updateEventValidator,
  updateEvent
); /** */

router.delete(
  "/:id",
  protect,
  allowedTo("club_responsible", "system_responsible"),
  restrictToResourceOwner(EventModel, "author"),
  deleteEventValidator,
  deleteEvent
);

router.get(
  "/club/:clubId",
  protect,
  allowedTo("student", "club_responsible", "system_responsible"),
  getEventsByClubValidator,
  getEventsByClub
);

module.exports = router;
