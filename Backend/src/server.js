import app from "./app.js"
import dotenv from "dotenv";
import { connectDb } from "./db/index.js";
import { createServer } from "http";
import { Server } from "socket.io";


dotenv.config({
    path : ".env",
})

const port = process.env.PORT || 4000;


const server = createServer(app);
const io = new Server(server , {
    cors : {origin : process.env.CORS_ORIGIN , credentials : true}
})

export { io }

connectDb()
.then(() => {
    app.listen(port , (req , res) => {
        console.log(`Server is running on port : ${port}`)
    })
})
.catch((error) => {
    console.log("Mongoose error : " , error)
})