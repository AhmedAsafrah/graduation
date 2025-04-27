const express = require("express");
const router = express.Router();

const authService = require("../services/authService");
const EventModel = require("../models/eventModel");
const { createComment } = require("../services/commentService");
const { restrictToResourceOwner } = require("../middleware/restrictResourceMiddleware");
const { setAuthor } = require("../middleware/setAuthorMiddleware");
const { createCommentValidator } = require("../validators/commentValidator");
const { protect, allowedTo } = authService;

const {
  createEvent,
  getAllEvents,
  getEvent,
  updateEvent,
  deleteEvent,
} = require("../services/eventService");

const {
  createEventValidator,
  getSpecificEventValidator,
  updateEventValidator,
  deleteEventValidator,
} = require("../validators/eventValidator");

///////////////////////////////////////////////////// ******* ROUTES ******* /////////////////////////////////////////////////////

router.post(
  "/",
  protect,
  allowedTo("club_responsible", "system_responsible"),
  setAuthor,
  createEventValidator,
  createEvent
);

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

      res.status(201).json({
        status: "success",
        data: {
          comment,
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
  updateEventValidator,
  updateEvent
);

router.delete(
  "/:id",
  protect,
  allowedTo("club_responsible", "system_responsible"),
  restrictToResourceOwner(EventModel, "author"),
  deleteEventValidator,
  deleteEvent
);

module.exports = router;