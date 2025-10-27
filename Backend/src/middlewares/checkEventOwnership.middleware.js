import { Event } from "../models/events.models.js";
import { ApiError } from "../utils/ApiError.js";

export const checkEventOwnership = async (req, res, next) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: "Event not found" });

  if (req.user.role === "admin") return next();

  if (req.user.role === "organizer" && event.createdBy.toString() === req.user._id.toString()) {
    return next();
  }

  return res.status(403).json({ message: "You are not authorized to perform this action" });
};
