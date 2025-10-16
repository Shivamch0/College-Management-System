import express from "express";
import { registerUser , loginUser , logoutUser } from "../controllers/user.controllers.js";

const router = express.Router()

router.route("/register").post(registerUser);

router.post("/login" , loginUser);

router.post("/logout" , logoutUser)


export default router