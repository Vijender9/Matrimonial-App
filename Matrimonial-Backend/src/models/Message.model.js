import mongoose from "mongoose";
const messageSchema= new mongoose.Schema({
   sender:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
},
receiver:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,
},
content:{
    type:String,
    required:true,

},
isRead:{
    type:Boolean,
    default:false
},
created: {
    type: Date,
    default: Date.now
  }
},{timestamps:true})

export const Message = mongoose.model("Message",messageSchema);