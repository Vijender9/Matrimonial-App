import { User } from "../models/User.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

const getPublicProfiles= asyncHandler(async(req,res)=>{
    const profiles= await User.find({isApproved:true}).select
    (" name profilePic city profession gender").limit(20);
    if(!profiles){
        throw new ApiError(404,"Not approved users");
    }
    res.status(200).
    json(new ApiResponse(200,profiles,"Limited profiles fetched Successfully"))
})

export{getPublicProfiles}