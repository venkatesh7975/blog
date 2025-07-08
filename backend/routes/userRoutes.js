import express from "express";
import {onLogin,onRegister} from "../controllers/userController.js";

const router=express.Router();

router.post("/register",onRegister);
router.post("/login",onLogin)

export default router;
