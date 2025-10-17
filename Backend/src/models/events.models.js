import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    description : {
        type : String,
    },
    date : {
        type : String,
        required : true
    },
    venue : {
        type : String,
        required : true
    },
    eventType: {
        type: String,
        enum: ["Cultural", "Technical", "Sports", "Workshop", "Seminar" ,"Other"],
        default: ""
    },
    currentParticipants: {
        type: Number,
        default: 0
    },
    maxParticipants: {
        type: Number,
        default: 100
    },
    createdBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    participants : [
        {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        }
    ],
    status : {
        type : String,
        enum : ["pending", "approved" , "rejected"],
         default : "pending",
        required : true
    },
} , {timestamps : true});



export const Event = mongoose.model("Event" , eventSchema);