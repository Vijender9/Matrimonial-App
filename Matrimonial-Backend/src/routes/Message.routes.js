import express from "express"
import { getMyChatList,getConversation,sendMessage ,markMessagesAsRead,getUnreadCounts} from "../controllers/message.controller.js";
import { adminAuthMiddleware } from "../middlewares/adminAuth.middleware.js";
import authMiddleware from "../middlewares/auth.middleware.js";


const router=express.Router();
 

router.use(authMiddleware)
router.get("/recentMessages",getMyChatList);
router.get("/chat/:userId",getConversation);
router.post("/send/:receiverId",sendMessage)

router.patch("/markAsRead/:userId",markMessagesAsRead)
router.get("/unreadCounts",getUnreadCounts)
export default router