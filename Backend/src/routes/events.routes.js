import express, { Router } from "express";
import { body } from "express-validator";
import { createEvent , getAllEvents , getEventByID , registerForEvent , cancelRegistration , updateEvent , deleteEvent } from "../controllers/event.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";

const router = express.Router();

router.route("/").get(getAllEvents);
router.route("/:id").get(getEventByID);

router.route("/create").post(verifyJWT ,
                            authorizeRoles("admin" , "organizer"),
                            [
                                body("title").notEmpty().withMessage("Title is required..."),    
                                body("date").notEmpty().withMessage("Date is required..."),    
                                body("venue").notEmpty().withMessage("Venue is required..."),    
                            ],
                            validate,
                            createEvent);

router.route("/:id/update").put(verifyJWT , authorizeRoles("admin" , "organizer") , updateEvent);

router.route("/:id/delete").delete(verifyJWT , authorizeRoles("admin" , "organizer") , deleteEvent);

router.route("/:id/register").post(verifyJWT , authorizeRoles("student") , registerForEvent);
router.route("/:id/cancel").post(verifyJWT , authorizeRoles("student") , cancelRegistration);



export default router