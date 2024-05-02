// import express from "express";
import {Router} from  "express";
import {registerUser} from  "../controllers/user.controllers.js"
import {upload} from "../middlewares/multer.middlewares.js"
import {loginUser} from "../controllers/user.controllers.js"
import {logoutUser} from "../controllers/user.controllers.js"
import {verifyJWT} from  "../middlewares/auth.middlewares.js"
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
router.route("/loginUser"),post(loginUser)

router.route("/logout").post(
    verifyJWT ,logoutUser
)

export default router;
// Compare this snippet from src/utils/asyncHandler.js: