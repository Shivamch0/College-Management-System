import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    userName : {
        type : String,
        required : true,
        lowercase : true,
        trim : true,
        index : true
    },
    fullName : {
        type : String,
        required : true,
        trim : true,
        index : true
    },
    email : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true,
    },
    password : {
        type : String,
        required : true,
        minlength : 6
    },
    role : {
        type : String,
        enum : ["Admin" , "Faculty" , "Student"] , default : "Student",
        required : true
    },
    registeredEvents : [
        {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Event",
        required :true,
        default : []
        }
    ],
    refreshToken : {
        type : String
    }
} , {timestamps : true});

userSchema.pre("save" , async function (next) {
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password , 10);
    next();
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password , this.password);
}

userSchema.methods.generateAccessToken =  function () {
    return jwt.sign({
        _id : this._id,
        email : this.email,
        username : this.username,
        fullname : this.fullName,
        role : this.role
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken =  function () {
    return jwt.sign(
        {
            _id : this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User" , userSchema);