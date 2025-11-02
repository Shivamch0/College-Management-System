import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";


const app = express();

const allowedOrigins = process.env.CORS_ORIGIN.split(",");

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        origin.endsWith(".netlify.app")
      ) {
        callback(null, true);
      } else {
        console.error(" Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

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