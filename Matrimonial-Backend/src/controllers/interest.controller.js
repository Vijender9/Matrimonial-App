import { User } from "../models/User.model";
import { Interest } from "../models/Interest.model.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const sendInterest= asyncHandler(async(req,res)=>{
    const receiverId= req.params.receiverId;
    const senderId= req.user._id;
      if(senderId===receiverId){
        throw new ApiError(404,"You can not send Interest to Yourself");
      }
      const alreadySent= await Interest.findOne({
          sender:senderId,
          receiver:receiverId
      });
      if(alreadySent){
        throw new ApiError(400,"Interest Already Sent");
      }
      const interest=await Interest.create({sender:senderId,receiver:receiverId});
      res.status(200).
      json(new ApiResponse(200,interest,"Interest sent Successfully"))

      
})

  // get tose interested which i sent

 const getSentInterest= asyncHandler(async(req,res)=>{
    const interests= await Interest.find({sender:req.user._id}).populate("receiver  name profilePic");
    res.status(200).json(new ApiResponse(200,interests," sentInterest Fecthed Successfully"))
 })

 const getReceivedInterest=asyncHandler(async(req,res)=>{
    const interests= await Interest.find({receiver:req.user._id}).populate("sender"," name profilePic");

    res.status(200).json(new ApiResponse(200,interests,"People who sent you interest"));
 })


export {sendInterest,getSentInterest,getReceivedInterest};