// import express from "express";
import {Router} from  "express";
import {registerUser} from  "../controllers/user.controllers.js"

const router = Router();

router.route("/register").post(
    registerUser
    )

export default router;
// Compare this snippet from src/utils/asyncHandler.js: