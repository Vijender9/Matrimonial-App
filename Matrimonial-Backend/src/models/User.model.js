import mongoose from "mongoose";

const userSchema= new mongoose.Schema({

  name:{
    type:String,
    required:true,
  },
  email:{
    type:String,
    unique:true,
  },
  phone:{
    type:String
  },
  password:{
    type:String,
    required:true,

  },gender:{
    type:String
  },
  dob:{
    type:Date,

  },religion:{
    type:String
  },
  caste:{
    type:String
  },
  profession:{
    type:String
  },
  isPremium:{
    type:Boolean,
    default:false
  },
  // shortlisted:[{
  //   type:mongoose.Schema.Types.ObjectId,
  //   ref:"User"
  // }],  already made different model there is more scalable
  profilePic:{
    type:String,
    default:""
  },
  isApproved:{
    type:Boolean,
    default :false,
  },

  photoStatus:{
    type:String,
    enum:['pending','approved','rejected']
  },
  matchPreferences:{
    ageRange:{
      min:{type:Number},
      max:{type:Number}
    },
    religion:String,
    caste:String,
    profession:String,
    location:String
  },
  planType:{
    type:String,
    enum:['free','premium'],
    default:'free'
  },
  role:{
    type:String,
    enum:['user','admin','moderator'],
    default:'user'
  }



},{timestamps:true})

const User=mongoose.model("User",userSchema);
export{User}