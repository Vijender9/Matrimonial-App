import express from "express";
import { getPublicProfiles } from "../controllers/public.controller.js";

const router=express.Router();

router.get("/public-profiles",getPublicProfiles);
export  default router;