import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import  { Event } from "../models/events.models.js"

const createEvent = asyncHandler ( async (req , res) => {
    const {title , description , date , venue , eventType , maxParticipants} = req.body;
    if(!title || !date || !venue ){
        throw new ApiError(401 , "Title , Date and Venue are required...")
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

    return res.status(200).json(new ApiResponse(200 , event , "Event Created Successfully..."));
});

const getAllEvents = asyncHandler ( async (req , res) => {
    const events = await Event.find().populate("createdBy" , "userName email")
    return res.status(200).json(new ApiResponse(200 , events , "All events fetched successfully..."))

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
        throw new ApiError(401 , "Event not found...");
    }

    if(event.currentParticipants >= event.maxParticipants){
        throw new ApiError(400, "Event is already full.");
    }

    if(event.participants.includes(req.user._id)){
        throw new ApiError(401 , "You are already registered for this event...")
    }

    event.participants.push(req.user._id);
    event.currentParticipants++;
    await event.save({validateBeforeSave : false});

    return res
        .status(200)
        .json(new ApiResponse(200, event, "Registered for event successfully."));
});

const cancelRegistration = asyncHandler ( async (req , res) => {
    const event = await Event.findById(req.params.id);
    if(!event){
        throw new ApiError(401 , "Event not found...");
    }

    event.participants = event.participants.filter(
        (id) => id.toString() !== req.user._id.toString()
    );
    event.currentParticipants = event.participants.length;
    await event.save({validateBeforeSave : false})

    return res.status(200).json(new ApiResponse(200 , event , "Registration cancelled successfully..."))
});

const updateEvent = asyncHandler ( async (req , res) => {
    const event = await Event.findByIdAndUpdate(req.params.id , req.body , {new : true});
    if(!event){
        throw new ApiError(401 , "Event not found...");
    }

    return res.status(200).json(new ApiResponse(200 , event , "Event Update Successfully..."))
});

const deleteEvent = asyncHandler ( async (req , res) => {
    const event = await Event.findByIdAndDelete(req.params.id);
    if(!event){
        throw new ApiError(401 , "Event not found...");
    }

    return res.status(200).json(new ApiResponse(200 , event , "Event Delete Successfully..."))
});


export { createEvent , getAllEvents , getEventByID , registerForEvent , cancelRegistration , updateEvent , deleteEvent}