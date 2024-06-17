import mongoose, {isValidObjectId} from 'mongoose';
import {Video} from '../models/video.models';
import {User} from '../models/user.models';
import {apiError} from '../utils/apiError';
import {asyncHandler} from '../utils/asyncHandler';
import {cloudinary} from '../utils/cloudinary';
import {apiResponse} from '../utils/apiResponse';
      //TODO: get all videos based on query, sort, pagination

const  getAllVideos = asyncHandler(async(req,res)=>{
    const { 
        page = 1, 
        limit = 10, 
        query="",
        sortBy= "createdAt",
        sortType= "desc",
        userId ,
    } = req.query;
    if(!isValidObjectId(userId)){
        throw new apiError(400, "Invalid user id")
    }
// create  a video oject with the query params to be used in the aggregation pipelinefor the match stage 
// create a model aggregate  
try{
const videos = Video.aggregate([
        {
          $match: {
            owner: req.user?._id,
            title: { $regex: query, $options: "i" },
          },
        },
      ]).sort({
        [`${sortType}`]: `${sortBy}`,
      });

      //create a option object to be used in the paginate method for page and limit
      // create a option where there is a page and limit which is not defined early it may be any number
      const options = {
        page,
        limit
      };

      // create a data object becuase the paginate method returns an object with the data and the meta data
     // now we are using the aggregatePaginate method to paginate the videos that means in simple word 
     // we are using the aggregate method to get the videos and then paginate them as a callback function
      const data = await Video.aggregatePaginate(
        videos,
        options ,
        function (err,result){
            if(err){
                throw new apiError(400, "Video pagination is failed !")
            }
            return result
        }
      );

      return res
      .status(200)
      .json(
        apiResponse(
            true,
            "Videos fetched successfully",
            data
        )
      )
    }catch(error){
        throw new apiError(500, "something  went wrong while video pagination")
    }
});
      // TODO: get video, upload to cloudinary, create video

const     publishAVideo = asyncHandler(async(req,res)=>{

   const {title , description} = req.body;
   const {videoFile, thumbnail} = req?.files;

   const {path:videoFilePath} = videoFile[0]; //sqare brackets are used to get the first element of the array
   const {path:thumbnailPath} = thumbnail[0];

   if(!isValidObjectId(req.user?._id)){
       throw new apiError(400, "Invalid user id")
   }

   if(!videoFilePath || !thumbnailPath){
         throw new apiError(400, "Video file and thumbnail are required")
   }
try{
    //upload video to cloudinary
    const videofileResponse =await uploadOnCloudinary(videoFilePath);
    const thumbnailResponse =await uploadOnCloudinary(thumbnailPath);
    //now create a video object to be saved in the database
    const video = await Video.create({
        title,
        description,
        videoFile: videofileResponse.url,
        thumbnail: thumbnailResponse.url,
        duration: videofileResponse.duration,
        owner: req.user?._id
    });

    await video.save();
    return res
      .status(201)
      .json(new apiResponse(201, video, "Video published Successfully"));
  }
  catch (error) {
    throw new apiError(
      500,
      error?.message || "Something went wrong. Video not published!!"
    );
  }

});
const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
  
    if (!isValidObjectId(videoId)) {
      throw new apiError(400, "Invalid video id");
    }
  
    try {
      const video = await Video.findById({ _id: videoId });
  
      return res
        .status(200)
        .json(new apiResponse(200, video, "Video fech Successfully"));
    } catch (error) {
      throw new apiError(
        500,
        error?.message || "Something went wrong. Video not fetched!!"
      );
    }
    //TODO: get video by id
  });
  
  const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    //TODO: update video details like title, description, thumbnail
  });
  
  const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    //TODO: delete video
  });
  
  const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
  });

  export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
  };