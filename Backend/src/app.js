import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";


const app = express();

app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials : true
}));

app.use(express.json({limit : "16kb"}));
app.use(express.urlencoded({extended : true , limit : "16kb"}));
app.use(express.static("public"));

app.use(cookieParser());

import userRouter from "./routes/user.routes.js"
import eventRouter from "./routes/events.routes.js"
import adminRoute from "./routes/admin.routes.js"

// Routes //
app.use("/api/v1/users" , userRouter);
app.use("/api/v1/events" , eventRouter);
app.use("/api/v1/admin" , adminRoute)

app.get("/" , (req , res) => {
    res.send("CEMS Backend API is running...")
})

export default app;