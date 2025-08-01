import jwt from "jsonwebtoken"
import { asyncHandler } from "../utils/AsyncHandler.js"
import { User } from "../models/User.model.js"
import { ApiError } from "../utils/ApiError.js"


const adminAuthMiddleware= asyncHandler(async(req,res,next)=>{

    const authHeader=req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer")){
        throw new ApiError(404,"Unauthorized no tken provided");
    }
    const token= authHeader.split(" ")[1];
    const decoded= jwt.verify(token,process.env.JWT_SECRET);

    const user=await User.findById(decoded.userId).select("-password");
    if(!user){
        throw new ApiError(404,"User not found");
    }
    if(user.role!=="admin"){
        throw new ApiError(403,"Forbidden:Admin access required");
    }
    req.user=user;
    next();

});
export{adminAuthMiddleware}