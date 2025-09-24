import app from "./app.js"
import dotenv from "dotenv";
import { connectDb } from "./db/index.js";

dotenv.config({
    path : ".env",
})

const port = process.env.PORT || 4000;

connectDb()
.then(() => {
    app.listen(port , (req , res) => {
        console.log(`Server is running on port : ${port}`)
    })
})
.catch((error) => {
    console.log("Mongoose error : " , error)
})