import { adminAuthMiddleware } from "../middlewares/adminAuth.middleware.js";
import { Admin } from "../models/Admin.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { User } from "../models/User.model.js";


const adminLogin =asyncHandler(async(req,res)=>{
    const {email,password}=req.body;
    const admin=await Admin.findOne({email});
    if(!admin){
        throw new ApiError(400,"Admin not found");
    }

    const isPasswordValid= await bcrypt.compare(password,admin.password);
    if(!isPasswordValid){
        throw new ApiError(400,"Invalid password for admin");
    }
    const token= jwt.sign({
        userId:user._id,
        role:"admin"
     },process.env.JWT_SECRET,{expiresIn:"1d"}
);
   res.status(200).
   json(new ApiResponse(200,token,"Admin logged in successfully"))

})

const approveUser= asyncHandler(async(req,res)=>{
    const user= await User.findById(req.params.id);
       if(!user){
        throw new ApiError(404,"User not found for approved");
       }
       user.isApproved=true;
       await user.save();
       res.status(200).
       json(new ApiResponse(200,user,"User approved!"));
})

   const deleteUser= asyncHandler(async(req,res)=>{
       const user=await User.findByIdAndDelete(req.params.id);
        //if user then not deleted succsefuly

        res.status(200).
        json(new ApiResponse(200,user,"User deleted successfully"));
   })

   const approvePhoto= asyncHandler(async(req,res)=>{
          const user= await User.findByIdAndUpdate(
              req.params.id,
            {
                photoStatus:'approved'
              
          },{
            new :true
          }
        )

        res.status(200).
        json(new ApiResponse(200,user,"Photo approved"));
   })  

 const rejectPhoto = asyncHandler(async(req,res)=>{
       const user=await User.findByIdAndUpdate(
        req.params.id,{
            photoStatus:"rejected"
        },{
            new:true
        }
       )
       if(!user){
        throw new ApiError(404,"no User found")
       }
       res.status(200).json(new ApiResponse(200,user,"Photo rejected"));
 }) 
 
 const getPendingProfiles=asyncHandler(async(req,res)=>{
    const users= await User.find({isApproved:false});
    if(!users){
        throw new ApiError(404,"No Pending Profiles");
    }
    res.status(200).
    json(new ApiResponse(200,users,"User profiles pending response"));
 })

export{approveUser,adminLogin,deleteUser,approvePhoto,rejectPhoto,getPendingProfiles}
