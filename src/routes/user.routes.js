// import express from "express";
import {Router} from  "express";
import {registerUser} from  "../controllers/user.controllers.js"
import {upload} from "../middlewares/multer.middlewares.js"
const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
    )

export default router;
// Compare this snippet from src/utils/asyncHandler.js: