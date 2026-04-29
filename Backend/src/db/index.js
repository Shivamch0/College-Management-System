import mongoose from "mongoose";
import dns from 'dns'
import { DB_NAME } from "../constants.js";

dns.setServers(['1.1.1.1' , '8.8.8.8'])

const connectDb = async () => {
    try {
       const connectionInstance = await mongoose.connect(`${process.env.DB_URL}/${DB_NAME}`);

       console.log("\n Database connected successfully \n" , connectionInstance.connection.host);
    } catch (error) {
        console.log("Database connection Failed : " , error);
        process.exit(1);
    }
}

export {connectDb};