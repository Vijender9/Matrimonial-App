import express from "express"
import { getMyShotlists,removeFromShortlist,addToShortlist, getMutualMatches } from "../controllers/shortlist.controller.js"
import authMiddleware from "../middlewares/auth.middleware.js"

const router=express.Router();
console.log("im at router")
router.post("/:to",authMiddleware,addToShortlist);
router.delete("/:to",authMiddleware,removeFromShortlist);
router.get("/shortlisted",authMiddleware,getMyShotlists);
router.get('/matches',authMiddleware,getMutualMatches);
export default router