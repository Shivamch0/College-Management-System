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

export { getAdminStatus }