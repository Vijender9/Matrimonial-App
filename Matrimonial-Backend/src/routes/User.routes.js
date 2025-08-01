import express from "express";
import { createUser,getAllUsers,currentUser,loginUser, searchUser, updateUser ,getUserById} from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
const router=express.Router();

router.post('/register',createUser);
router.get('/',getAllUsers);
router.post('/login',loginUser);
router.get('/currentUser', authMiddleware,currentUser);
router.patch('/updateProfile',authMiddleware,upload.single("profilePic"),updateUser);
router.get('/search',authMiddleware,searchUser);
router.get('/:userId',authMiddleware,getUserById)
// profile user

export  default router