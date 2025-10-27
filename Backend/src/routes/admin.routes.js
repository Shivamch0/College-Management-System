import express from "express";
import { getAdminStatus, getAllUsers , getAllEvents , getAllRegistrations } from "../controllers/admin.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = express.Router();

router.route("/status").get(verifyJWT , getAdminStatus);

router.route("/users").get(verifyJWT , getAllUsers);

router.route("/events").get(verifyJWT , getAllEvents);

router.route("/registerations").get(verifyJWT , getAllRegistrations);

export default router