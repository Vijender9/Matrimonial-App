import { ShortList } from "../models/Shortlist.model.js";

import { ApiError, } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/User.model.js";


const addToShortlist= asyncHandler(async(req,res)=>{

    
    const from=req.user._id;
    const to=req.params.to;
    if(from.toString()===to.toString()){
        throw new ApiError(404,"You cant shortlist yourself!");
    }
    const alreadyShorlisted=await ShortList.findOne({from,to});
    if(alreadyShorlisted){
        throw new ApiError(404,"Already shortlisted");
    }
    const shortlist=await ShortList.create({from,to});
    res.status(201)
    .json( new ApiResponse(201,shortlist,"User shortlisted"));
})

const removeFromShortlist= asyncHandler(async(req,res)=>{
    const from=req.user._id;
    const to=req.params.to;
    const result= await ShortList.findOneAndDelete({from,to});
    if(!result){
        throw new ApiError(404,"Shortlist not found");
    }
    res.status(200)
    .json(new ApiResponse(200,null,"User unshortlisted successfully"));
})

const getMyShotlists= asyncHandler(async(req,res)=>{
   
    const from=req.user._id;

    const list=await ShortList.find({from}).populate("to","-password");
    res.status(200)
    .json(new ApiResponse(200,list,"Your shortlisted user"));

})

const getMutualMatches =asyncHandler(async(req,res)=>{
       const userId=req.user._id;
       
       //users im gonna shortlist
       const youShorlisted=await ShortList.find({from:userId}).select("to");
       console.log("youShorlisted:",youShorlisted)

       const shortistedIds=youShorlisted.map((s)=>s.to.toString());

      
      //users who shorlisted you

       const shortlistedYou=await ShortList.find({to:userId}).select("from");
       const shortlistedYouIds=shortlistedYou.map((s)=>s.from.toString());

       const mutualIds=shortistedIds.filter(id=>shortlistedYouIds.includes(id));
       const matches=await User.find({_id:{$in:mutualIds}}).select("-password");
       
       res.status(200).
       json(new ApiResponse(200,matches,"Mutual mtches fetched"))
})

 
export{getMyShotlists,removeFromShortlist,addToShortlist,getMutualMatches}