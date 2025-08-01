import mongoose from "mongoose";
import { Message } from "../models/Message.model.js";
import { User } from "../models/User.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";


const sendMessage= asyncHandler(async(req,res)=>{
    console.log("im at sending message at backend")
    const senderId=req.user._id;
    const receiverId= req.params.receiverId;
    const{content}=req.body;

    if(senderId===receiverId){
        throw new ApiError(404,"You can not send message to yourself");
    }
    const message=await Message.create({sender:senderId,
        receiver:receiverId,
        content
    })
    res.status(200).json(new ApiResponse(200,message,"Message send Successfully"))
})

const getConversation= asyncHandler(async(req,res)=>{

    console.log("im at converstaion chat")
    const userId= req.user._id;
    const otherUserId= req.params.userId;
    console.log("userId must be",userId);
    console.log("otherUserId",otherUserId)
    const conversations= await Message.find({
        $or:[
            {sender:userId,receiver:otherUserId},
            {sender:otherUserId,receiver:userId}
        ]
    }).sort({created:1}) ; // oldest to newest

    res.status(200).json(new ApiResponse(200,conversations,"Conversation fetched successfully"));
})

const getMyChatList = asyncHandler(async (req, res) => {
      //  await Message.deleteMany({});
      //  console.log("All messages deleted.");   // deleted all messages from databse every users how can i control this
    
  const userId = req.user._id;

  const recentMessages = await Message.aggregate([
    {
      $match: {
        $or: [
          { sender: new mongoose.Types.ObjectId(userId) },
          { receiver: new mongoose.Types.ObjectId(userId) }
        ]
      }
    },
    { $sort: { created: -1 } },
    {
      $group: {
        _id: {
          $cond: [
            { $eq: ["$sender", new mongoose.Types.ObjectId(userId)] },
            "$receiver",
            "$sender"
          ]
        },
        lastMessage: { $first: "$$ROOT" }
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user"
      }
    },
    { $unwind: "$user" },

    // 👇 Get unread messages count from this person to current user
    {
      $lookup: {
        from: "messages",
        let: { userId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$sender", "$$userId"] },
                  { $eq: ["$receiver", new mongoose.Types.ObjectId(userId)] },
                  { $eq: ["$isRead", false] }
                ]
              }
            }
          },
          { $count: "count" }
        ],
        as: "unread"
      }
    },
    {
      $addFields: {
        unreadCount: { $ifNull: [{ $arrayElemAt: ["$unread.count", 0] }, 0] }
      }
    },
    {
      $project: {
        lastMessage: 1,
        user: { _id: 1, name: 1, profilePic: 1 },
        unreadCount: 1
      }
    },
    { $sort: { "lastMessage.created": -1 } } // ✅ Ensure sorting is correct
  ]);

  res.status(200).json(new ApiResponse(200, recentMessages, "Chat List got successfully"));
});

const markMessagesAsRead= asyncHandler(async(req,res)=>{
    console.log("inside mark as read")
    const userId=req.user._id;
    const senderId=req.params.userId;

    const readTrue= await Message.updateMany(
        {sender:senderId,
        receiver:userId,
        isRead:false},
        {
            $set:{isRead:true}
        }

        )
        console.log("read true is :",readTrue);
        res.status(200).json(new ApiResponse(200,readTrue,"Message Read successfully"));

})

const getUnreadCounts= asyncHandler(async(req,res)=>{
    const userId=req.user._id;

    const counts= await Message.aggregate([
        {
            $match:{
                receiver:userId,isRead:false
            }
        },
        {
            $group:{
                _id:"$sender",
                unreadCount:{$sum:1}
            }
        },
        {
            $lookup:{
                 from:"users",
                 localField:"_id",
                 foreignField:"_id",
                 as:"senderInfo"
            }
        },{
            $unwind:"$senderInfo"
        },
        {
            $project:{
                userId:"$senderInfo._id",
               name: "$senderInfo.name",
             profilePic: "$senderInfo.profilePic",
           unreadCount: 1
            }
        }

    ]);
    res.status(200).json(new ApiResponse(200,counts,"Unread Message counts"))
})



export{sendMessage,getConversation,getMyChatList,markMessagesAsRead,getUnreadCounts}