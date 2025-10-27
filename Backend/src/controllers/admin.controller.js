import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { Event } from "../models/events.models.js";

const getAdminStatus = asyncHandler (async (req , res) => {
    const totalUsers = await User.countDocuments();
    const totalEvents = await Event.countDocuments();

    const allEvents = await Event.find({} , "participants");
    const totalRegistrations = allEvents.reduce(
        (sum , event) => sum + event.participants.length,
        0
    );

    return res.status(200).json(
    new ApiResponse(200, {
      users: totalUsers,
      events: totalEvents,
      registrations: totalRegistrations,
    }, "Admin stats fetched successfully.")
  );
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}, "fullName email role");
  return res.status(200).json(new ApiResponse(200, users, "Users fetched successfully."));
});

const getAllEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({}, "title date participants");
  return res.status(200).json(new ApiResponse(200, events, "Events fetched successfully."));
});

const getAllRegistrations = asyncHandler(async (req, res) => {

  const events = await Event.find({})
    .populate("participants", "fullName email role createdAt") 
    .select("title participants date createdAt");

  const registrations = events.flatMap((event) =>
    event.participants.map((user) => ({
      user: {
        name: user.fullName,
        email: user.email,
        role : user.role
      },
      event: {
        title: event.title,
      },
      createdAt: event.createdAt || new Date(),
    }))
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      registrations,
      "All registrations fetched successfully."
    )
  );
});

export { getAdminStatus , getAllUsers , getAllEvents , getAllRegistrations }