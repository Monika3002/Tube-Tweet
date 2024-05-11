// import express from "express";
import {Router} from  "express";
import {
    registerUser , 
    loginUser ,
    logoutUser,
    refreshToken,
    getCurrentUser,
    changeCurrentPassword,
    updateUserAccountDetails,
    updateAvatar,
    updateCoverImage,
    getUserChannelProfile,
    getUserWatchHistory,
} from  "../controllers/user.controllers.js"
import {upload} from "../middlewares/multer.middlewares.js"
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
router.route("/login").post(loginUser)

 //secured route means user need to be logged in to access this route

router.route("/logout").post(
    verifyJWT , logoutUser
)

router.route("/refresh-Token").post(refreshToken)

router.route("/current-user").get(verifyJWT , getCurrentUser)

router.route("/change-Password").post(verifyJWT , changeCurrentPassword)

router.route("/update-Account-Details").patch(verifyJWT , updateUserAccountDetails)

router.route("/update-Avatar").patch(
    verifyJWT,
    upload.single("avatar"),
    updateAvatar
)

router.route("/update-Cover-Image").patch(
    verifyJWT,
    upload.single("coverImage"),
    updateCoverImage
)

router.route("/c/:username").get(verifyJWT ,getUserChannelProfile)

router.route("/watch-history").get(verifyJWT , getUserWatchHistory)

export default router;
// Compare this snippet from src/utils/asyncHandler.js: