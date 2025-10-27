import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import  { Event } from "../models/events.models.js";
import { io } from "../server.js";
import { sendEmail } from "../utils/email.js";
import { eventValidationSchema , eventUpdateValidationSchema } from "../validators/event.validator.js";

const createEvent = asyncHandler ( async (req , res) => {

    const  {error } = eventValidationSchema.validate(req.body , {abortEarly : false});
    if(error){
        const messages = error.details.map(detail => detail.message);
        throw new ApiError(400, messages.join(", "));
    }

    if (req.user.role !== "admin" && req.user.role !== "organizer") {
    throw new ApiError(403, "Only admins or organizers can create events");
    }

    const {title , description , date , venue , eventType , maxParticipants} = req.body;
    if (!title || !date || !venue) {
    throw new ApiError(400, "Title , Date and Venue are required...");
    }

    const event = await Event.create({
        title,
        description,
        date,
        venue,
        eventType,
        maxParticipants,
        createdBy : req.user._id,
    })

    io.emit("Event Created..." , event);

    await sendEmail(
        req.user.email,
        "Event Created Successfully...",
        `You have Successfully Created an ${event.title} event that was going to held on ${event.date} at ${event.venue}`
    )

    return res.status(200).json(new ApiResponse(200 , event , "Event Created Successfully..."));
});

const getAllEvents = asyncHandler ( async (req , res) => {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page -1) * limit;

    const { search, eventType, startDate, endDate , sortBy , sortOrder } = req.query;

    const query = {}

    if(search){
        query.$or = [
            {title : {$regex : search , $options : "i"}},
            {description: {$regex : search , $options : "i"}}
        ];
    }

    if(eventType){
        query.eventType = eventType;
    }

    if(startDate || endDate){
        query.date = {};
        if(startDate) query.date.$gte = startDate;
        if(endDate) query.date.$lte = endDate;

    }

    const sortField = sortBy || "date";
    const sortDirection = sortOrder === "asc" ? 1 : -1;

    const events = await Event.find(query).populate("createdBy" , "_id userName email").sort({ [sortField] : sortDirection}).skip(skip).limit(limit);

    const totalEvents = await Event.countDocuments(query);
    const totalPages = Math.ceil(totalEvents / limit);

    return res.status(200).json(
        new ApiResponse(
            200 ,
             {
                events,
                currentPage : page,
                totalPages,
                totalEvents,
                pageSize : limit
             } , 
             "All events fetched successfully with pagination..."
        )
    )

});

const getEventByID = asyncHandler ( async (req , res) => {
    const event = await Event.findById(req.params.id).populate("participants" , "userName email");
    if(!event){
        throw new ApiError(401 , "Event not found...");
    }

    return res.status(200).json(new ApiResponse(200 , event , "Event details fetched successfully..."))
});

const registerForEvent = asyncHandler ( async (req , res) => {
    const event = await Event.findById(req.params.id);
    if(!event){
        throw new ApiError(404 , "Event not found...");
    }

    if(event.maxParticipants && event.currentParticipants >= event.maxParticipants){
        throw new ApiError(400, "Event is already full.");
    }

    if(event.participants.includes(req.user._id)){
        return res.status(200).json(new ApiResponse(201 , {} , "You have already registered for this event..."))
    }

    event.participants.push(req.user._id);
    event.currentParticipants++;
    await event.save({validateBeforeSave : false});

    req.user.registeredEvents.push(event._id);
    await req.user.save({ validateBeforeSave: false });

    await sendEmail(
        req.user.email,
        "Event Registration Successfully...",
        `You have successufully registered for ${event.title} that is going to held on ${event.date} at ${event.venue}.`
    )

    io.emit("Event Updated..." , event);

    return res
        .status(200)
        .json(new ApiResponse(200, event, "Registered for event successfully."));
});

const cancelRegistration = asyncHandler ( async (req , res) => {
    const event = await Event.findById(req.params.id);
    if(!event){
        throw new ApiError(404 , "Event not found...");
    }

    event.participants = event.participants.filter(
        (id) => id.toString() !== req.user._id.toString()
    );
    event.currentParticipants = event.participants.length;
    await event.save({validateBeforeSave : false})

     req.user.registeredEvents = req.user.registeredEvents.filter(
    (id) => id.toString() !== event._id.toString()
    );
    await req.user.save({ validateBeforeSave: false });

    await sendEmail(
        req.user.email,
        "Cancel Registration...",
        `You have canceled your registration successfully... for ${event.title} that was going to held on ${event.date} at ${event.venue}`
    )

    io.emit("Event Updated..." , event);

    return res.status(200).json(new ApiResponse(200 , event , "Registration cancelled successfully..."))
});

const updateEvent = asyncHandler ( async (req , res) => {
    
    const { error } = eventUpdateValidationSchema.validate(req.body, { abortEarly: false });
    if (error) {
        const messages = error.details.map(detail => detail.message);
        throw new ApiError(400, messages.join(", "));
    }

    const event = await Event.findByIdAndUpdate(req.params.id , req.body , {new : true});
    if(!event){
        throw new ApiError(404 , "Event not found...");
    }

    if (req.user.role !== "admin" && event.createdBy.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to update this event");
    }

    Object.assign(event , req.body);
    await event.save();

    await sendEmail(
        req.user.email,
        "Update Event",
        `You have successfully update the ${event.title} that was going to held on ${event.date} at ${event.venue}`
    )

    
    io.emit("Event Updated..." , event);

    return res.status(200).json(new ApiResponse(200 , event , "Event Update Successfully..."))
});

const deleteEvent = asyncHandler ( async (req , res) => {
    const event = await Event.findByIdAndDelete(req.params.id);
    if(!event){
        throw new ApiError(404 , "Event not found...");
    }

     await sendEmail(
        req.user.email,
        "Delete Event",
        `You have successfully delete the ${event.title} that was going to held on ${event.date} at ${event.venue}`
    )

    io.emit("Event Updated..." , event);

    return res.status(200).json(new ApiResponse(200 , event , "Event Delete Successfully..."))
});

export { createEvent , getAllEvents , getEventByID , registerForEvent , cancelRegistration , updateEvent , deleteEvent}