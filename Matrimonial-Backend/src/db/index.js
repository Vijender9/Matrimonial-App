import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


const connectDB =async()=>{
    try{

        console.log("im iside database connection")
       
       const connectionInstance= await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
            console.log(`\n MongoDB conneted!! DB HOST:${connectionInstance.connection.host}`)
    }
    catch(error){
        console.log("MONGODB not connected",error);
        process.exit(1);
    }

}
export {connectDB}