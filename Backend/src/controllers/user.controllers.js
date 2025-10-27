import { User } from "../models/user.models.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const registerUser = asyncHandler (async (req , res) => {
    const {userName , fullName , email , password , role} = req.body;

    if(!userName  || !fullName || !email || !password || !role){
        throw new ApiError(400 , "All field are required...");
    }
    
    const existedUser = await User.findOne({email});
    if(existedUser){
        throw new ApiError(400 , "User already exists with this email...")
    }

    // Create a new user // 
    const user = await User.create({
        fullName,
        userName ,
        email : email.toLowerCase(),
        password,
        role : role.toLowerCase()
    });

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if(!createdUser){
        throw new ApiError(500 , "Something went wrong while registering the user...")
    };

    const options = {
        httpOnly : true,
        secure : process.env.NODE_ENV === "production",
        sameSite : "none",
        maxAge : 7 * 24 * 60 * 60 * 1000
    };

    return res.status(201)
    .cookie("accessToken" , accessToken , options)
    .cookie("refreshToken" , refreshToken , options)
    .json(
        new ApiResponse(200 , {user : createdUser} , "User Created Successfully...")
    )
 
});

const loginUser = asyncHandler(async(req , res) => {
    const {email , password} = req.body;

    if(!email || !password){
        throw new ApiError(400 , "Email and Password Required...");
    }

    const user = await User.findOne({email})
    if(!user){
        throw new ApiError(404 , "User not found with this email...")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)
    if(!isPasswordValid){
        throw new ApiError(401 , "Invalid Email or Password...")
    }

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({validateBeforeSave : false})

    const accessTokenOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    maxAge: 15 * 60 * 1000 // 15 min
    };

    const refreshTokenOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    };

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    return res.status(200)
    .cookie("accessToken" , accessToken , accessTokenOptions)
    .cookie("refreshToken" , refreshToken , refreshTokenOptions)
    .json(new ApiResponse(200 , 
        { user : loggedInUser }, 
    "User Logged in Successfully..."))
});

const logoutUser = asyncHandler( async (req , res) => {
    const refreshToken = req.cookies?.refreshToken;
    if(!refreshToken){
        throw new ApiError(400 , "No Refresh Token Provided...")
    }

    const user = await User.findOne({refreshToken});
    if(!user){
        throw new ApiError(404 , "User not found or already logged out.")
    }

    user.refreshToken = null;
    await user.save({validateBeforeSave : false})

    const options = {
        httpOnly : true,
        secure : process.env.NODE_ENV === "production",
        sameSite : "none",
        path: "/",
    };

    res.clearCookie("accessToken" , options)
    res.clearCookie("refreshToken" , options)
    .status(200)
    .json(new ApiResponse(200 , {} , "User Logout Successfully..."))

});

const refreshAccessToken = asyncHandler(async (req , res) => {
    const incommingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
    if(!incommingRefreshToken){
        throw new ApiError(401 , "Refresh Token is missing");
    }
    
        const decoded = jwt.verify(incommingRefreshToken , process.env.REFRESH_TOKEN_SECRET);

        const user = await User.findById(decoded?._id);
        if(!user){
            throw new ApiError(401 , "User not found...")
        }

        if(user.refreshToken !== incommingRefreshToken){
            throw new ApiError(401 , "Invalid refresh Token...")
        }

        const accessToken = await user.generateAccessToken();
        const newRefreshToken = await user.generateRefreshToken();

        user.refreshToken = newRefreshToken;
        await user.save({validateBeforeSave : false})

        const options = {
            httpOnly : true,
            secure : process.env.NODE_ENV === "production",
            sameSite : "none",
            maxAge  : 7 * 24 * 60 * 60 * 1000
        }

        return res
                .status(200)
                .cookie("accessToken" , accessToken , options)
                .cookie("refreshToken" , newRefreshToken , options)
                .json(new ApiResponse(
                    200 , 
                    {accessToken , refreshToken : newRefreshToken} ,
                    "AccessToken refresh Successfully..."
                    )
                );
});

const getCurrentUser = asyncHandler (async (req , res) => {
   const user = await User.findById(req.user._id)
   .populate("registeredEvents" , " title venue date")
   .select("-password -refreshToken");
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { user }, "Current User Fetched Successfully..."));
})

export { registerUser , loginUser , logoutUser , refreshAccessToken , getCurrentUser }
