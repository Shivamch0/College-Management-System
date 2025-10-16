import express, { Router } from "express";
import { createEvent , getAllEvents , getEventByID , registerForEvent , cancelRegistration , updateEvent , deleteEvent } from "../controllers/event.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.route("/").get(getAllEvents);
router.route("/:id").get(getEventByID);

router.route("/create").post(verifyJWT , authorizeRoles("Admin" , "Organizer") , createEvent);
router.route("/:id/update").put(verifyJWT , authorizeRoles("Admin" , "Organizer") , updateEvent);
router.route("/:id/delete").delete(verifyJWT , authorizeRoles("Admin" , "Organizer") , deleteEvent);

router.route("/:id/register").post(verifyJWT , authorizeRoles("Student") , registerForEvent);
router.route("/:id/cancel").post(verifyJWT , authorizeRoles("Student") , cancelRegistration);



export default router