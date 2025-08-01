import express from "express"
import { adminLogin, approveUser, deleteUser ,getPendingProfiles,approvePhoto,rejectPhoto} from "../controllers/admin.controller.js";
import { adminAuthMiddleware } from "../middlewares/adminAuth.middleware.js";

const router=express.Router();
router.post("/login",adminLogin);
router.delete("/users/:id",adminAuthMiddleware,deleteUser);
router.patch("/users/:id/approve",adminAuthMiddleware,approveUser);
router.get("pending-Profiles",getPendingProfiles);
router.patch("rejectPhoto/:userId",rejectPhoto);
router.patch("approvePhoto/:userId",approvePhoto);

export  default router