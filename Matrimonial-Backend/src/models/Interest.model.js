import mongoose from "mongoose";
const interestSchema= new mongoose.Schema({
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    receiver:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    status:{
        type:String,
        enum:['sent',"accepted","rejected"],
        default :"sent"
    }
},{timestamps:true})
export const Interest= mongoose.model("Interest",interestSchema);