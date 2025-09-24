import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true,
    },
    role : {
        type : String,
        enum : ["Admin" , "Organizer" , "Student"],
        required : true
    },
    registeredEvents : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Event",
        required :true

    },
} , {timestamps : true});

export const User = mongoose.model("User" , userSchema);