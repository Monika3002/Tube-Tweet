
import { Router } from 'express';
import {
    deleteVideo,
    getAllVideos,
    getVideoById,
    publishAVideo,
    togglePublishStatus,
    updateVideo,
} from "../controllers/video.controllers.js"
import {verifyJWT} from "../middlewares/auth.middlewares.js"
import {upload} from "../middlewares/multer.middlewares.js"

const router = Router();

router.use(verifyJWT);
router.route('/').get(getAllVideos)
                 .post(upload.fields([
    {
        name:"vedio",
        maxCount:1
    },
    {
        name:"thumbnail",
        maxCount:1
    }
]),publishAVideo)

router.route('/:videoId').get(getVideoById)
                         .patch(upload.single("thumbnail"),updateVideo)
                         .delete(deleteVideo)

router.route('/toggle/publish/:videoId').get(togglePublishStatus)
export default router 
