import express from "express";
import { getAdminStatus } from "../controllers/admin.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = express.Router();

router.route("/status").get(verifyJWT , getAdminStatus);

export default router