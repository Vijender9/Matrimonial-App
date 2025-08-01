import mongoose from "mongoose";
import { User } from "./User.model.js";

const shortListSchema=new mongoose.Schema({

    from:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    to:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
},{timestamps:true})
export const ShortList=mongoose.model("ShortList",shortListSchema);