import jwt from "jsonwebtoken"
import { asyncHandler } from "../utils/AsyncHandler.js"
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/User.model.js";


const authMiddleware =asyncHandler(async(req,res,next)=>{

    const authHeader=req.headers.authorization;

      console.log("authHeader is :",authHeader);
    if(!authHeader || !authHeader.startsWith("Bearer")){
        throw new ApiError(401,"Unauthorized : No token provided");
    }

    const token= authHeader.split(" ")[1];
   
    const decoded =jwt.verify(token,process.env.JWT_SECRET);
   

    const user= await User.findById(decoded.userId).select("-password");
    if(!user){
        throw new ApiError(404,"User not found");
    }
    
    req.user=user;

   
    next();


})
export default authMiddleware