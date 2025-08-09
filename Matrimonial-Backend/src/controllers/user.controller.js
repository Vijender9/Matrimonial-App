import { User } from "../models/User.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { uploadOnCloudinary } from "../utils/cloudinary.js";



const createUser=asyncHandler(async(req,res)=>{

    const{name,email,phone,password,gender,dob,religion,caste,profession}=req.body;
  
    const userExist =await User.findOne({email});
    if(userExist){
        throw new ApiError(404,"User already Exist");
    };
    const hashedPassword= await bcrypt.hash(password,10);
   
    const user= await User.create({
        name,email,phone,password:hashedPassword,gender,dob,religion,caste,profession
    });
     res.status(201)
     .json( new ApiResponse(201,user,"User registerd successfully"));
})

const getAllUsers= asyncHandler(async(req,res)=>{
    const users=await User.find().select('-password');
   
    res.status(200,users,"ALL USERS FETCHED SUCCESSFULLY");
})

const loginUser=asyncHandler(async(req,res)=>{
    console.log("im inside login backend")
   
    const {email,password}=req.body;
    const user= await User.findOne({email});
    if(!user){
        throw new ApiError(404,"User not found");
    }
    if(!email || ! password){
        throw new ApiError(404,"email or password required!");

    }
    const confirmPassword= await bcrypt.compare(password,user.password)
      if(!confirmPassword){
        throw new ApiError(404,"Password doesnt match")
      }

    const token= jwt.sign({userId:user._id},process.env.JWT_SECRET,{
           expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    })

    const {password:pwd,...userData}=user._doc;
    const responseData={
       ...userData,token
    }
    res.status(200)
    .json(new ApiResponse(200, responseData,"Login successfull"))
})


const updateUser = asyncHandler(async (req, res) => {
    
  const userId = req.user._id;
  const updateFields = { ...req.body }; // clone to avoid mutation

  // Prevent restricted fields from being updated
  delete updateFields._id;
  delete updateFields.email;
  delete updateFields.password;

  // If file is uploaded, upload it to Cloudinary
  if (req.file?.path) {
    const cloudinaryResult = await uploadOnCloudinary(req.file.path);
     
    if (!cloudinaryResult) {
      throw new ApiError(500, "Upload failed");
    }
    updateFields.profilePic = cloudinaryResult.secure_url;
  }


//  Fix the shortlisted field if present
if (typeof updateFields.shortlisted === "string") {
  if (updateFields.shortlisted.trim() === "") {
    delete updateFields.shortlisted; // remove it entirely
  } else {
    updateFields.shortlisted = [updateFields.shortlisted];
  }
}

if (Array.isArray(updateFields.shortlisted)) {
  updateFields.shortlisted = updateFields.shortlisted.filter(
    (id) => id && id.trim() !== ""
  );
}
  // Update the user with combined fields
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: updateFields },
    {
      new: true,
      runValidators: true,
    }
  ).select("-password");
  console.log("updated User is :",updatedUser)

  if (!updatedUser) {
    throw new ApiError(404, "User not found or update failed");
  }

  res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "User updated successfully"));
});


const searchUser=asyncHandler(async(req,res)=>{
    const{
        gender,
        religion,
        caste,
        profession,
        minAge,
        maxAge,
        page=1,
        limit=10,
        name
    } = req.query;

    const filters={};
    if(gender)filters.gender=gender;
    if(religion)filters.religion=religion;
     if (caste) filters.caste = caste;
     if (profession) filters.profession = profession;

     if(name)filters.name={$regex:name,
        $options:"i"
     };

     if(minAge || maxAge){
        const today=new Date();
        const fromDOB=new Date(today.setFullYear(today.getFullYear()-maxAge||100));
         const toDOB = new Date(new Date().setFullYear(new Date().getFullYear() - minAge || 0));
    filters.dob = { $gte: fromDOB, $lte: toDOB }
     }

         filters._id = { $ne: req.user._id };
      const skipMe = (page - 1) * limit;
      const users=await User.find(filters).select("-password").skip(skipMe).limit(100);
      res.status(200)
      .json(new ApiResponse(200,users,"Filtered users fetched successfully"))



});

const currentUser=asyncHandler(async(req,res)=>{
   
    const user =req.user._id;
    if(!user){
        throw new ApiError(404,"NOt authorized");
    }
    const userInfo= await User.findOne( {_id: user }).select("-password");
   
    if(!userInfo){
        throw new ApiError(404,"User not valid");

    }
    res.status(200)
    .json(new ApiResponse(200,userInfo,"Current user fetched successfuly"));

})
const getUserById=asyncHandler(async(req,res)=>{
  const userId= req.params.userId;
  
  const user= await User.findById(userId).select("-password");
  
  if(!user){
    throw new ApiError(404,"User does not exist");
  }
  res.status(200).json(new ApiResponse(200,user,"Usr fetched succesfully"))
})





export {createUser,getAllUsers,loginUser,updateUser,searchUser,currentUser,getUserById}