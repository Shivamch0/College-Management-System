import express from "express";
import { registerUser , loginUser , logoutUser , refreshAccessToken , getCurrentUser } from "../controllers/user.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router()

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/refresh-token").post(refreshAccessToken);

router.route("/logout").post( logoutUser);

router.route("/current-user").get(verifyJWT , getCurrentUser)


export default router