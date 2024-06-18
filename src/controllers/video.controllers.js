import mongoose, {isValidObjectId} from 'mongoose';
import {Video} from '../models/video.models.js';
import {User} from '../models/user.models.js';
import {apiError} from '../utils/apiError.js';
import {asyncHandler} from '../utils/asyncHandler.js';
import {uploadOnCloudinary} from '../utils/cloudnary.js';
import {apiResponse} from '../utils/apiResponse.js';
      //TODO: get all videos based on query, sort, pagination

      const getAllVideos = asyncHandler(async (req, res) => {
        // const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
        const { page = 1, limit = 10, query, sortBy = 'createdAt', sortType = 'desc', userId } = req.query;

        //TODO: get all videos based on query, sort, pagination
    
    
    
        if(!userId){
            throw new apiError(400,"userid required")
        }
    
        const pipline = []
        if(userId){
            await User.findById(userId)
    
            pipline.push({
                $match:{
                    owner: new mongoose.Types.ObjectId(userId),   
                }
            })
        }
        console.log(query,typeof query);
        
    
        if(query){
            pipline.push({
                $match:{
                   isPublished:false
                }
            })
        }
    
        let createFeiild = {}
        if(sortBy && sortType){
            createFeiild[sortBy] = sortType === "asc" ?1:-1
            
            pipline.push({
                $sort:createFeiild
            })
        }
        else{
            createFeiild["createdAt"] =-1
            
            pipline.push({
                $sort:createFeiild
            })
        }
    
        pipline.push({
            $skip: (page - 1) * limit
        });
        pipline.push({
            $limit: 10
        });
        console.log(pipline);
        /*
        [
      { '$match': { owner: new ObjectId('65e0782461c4addc4efa7528') } },  
      { '$match': { isPublished: false } },
      { '$sort': { isPublished: 1 } },
      { '$skip': 0 },
      { '$limit': 10 }
    ] */
    
       const allVedios =  await Video.aggregate(pipline)
       if(!allVedios){
        throw new apiError(400,"pipline aggreagtion problem")
       }
    
       res.status(200).json(
        new apiResponse(
            200,
            allVedios,
            `all vedios are here count:${allVedios.length}` 
        )
       )
    
    
    })
    
    const publishAVideo = asyncHandler(async (req, res) => {
        const { title, description} = req.body;
        // TODO: get video, upload to cloudinary, create video
    console.log(title,description);
        
    
        if(!(title && description))
        {
            throw new apiError(400,"user should provide title and discription")
        }
    
        // console.log(req.files.video);
        // console.log(req.files.thumbnail);
    
        const videoUrl = req.files?.video[0]?.path
        const thumbnailUrl = req.files?.thumbnail[0]?.path
        console.log(videoUrl,thumbnailUrl);
    
        if(!videoUrl){
            throw new apiError(400,"vedio path is required")
        }
        if(!thumbnailUrl){
            throw new apiError(400,"thumbnail path is required")
        }
    
        // const video = await uploadOnCloudinary(vedioUrl)
        // const thumbnail = await uploadOnCloudinary(thumbnailUrl)
    
        const video = await uploadOnCloudinary(videoUrl); // Corrected typo here
        const thumbnail = await uploadOnCloudinary(thumbnailUrl);
     console.log(video,thumbnail);
    
        const videoData = await Video.create({
            video:video?.url,
            thumbnail:thumbnail?.url,
            owner:req.user?._id,  
            title:title,
            description:description,
            duration:video?.duration,
            views:0,
            isPublished : false,
        })
        return res.status(200).json(
            new apiResponse(
                200,
                vedioData,
                "Vedio published succcessfully"
    
            )
        )
    
    
    })
    
    const getVideoById = asyncHandler(async (req, res) => {
        const { videoId } = req.params
        //TODO: get video by id
    
    
       const userVedio = await Video.findById(videoId)
       console.log(userVedio?.owner.toString());
       console.log(req.user?._id.toString());
    
       if(!userVedio || ((!userVedio.isPublished) && (!userVedio.owner === req.user._id))){
        throw new apiError(400,"vedio ur seacrching for doesnot exist")
       }
    
    
    
       return res.status(200).json(
        new apiResponse(
            200,
            userVedio,
            "vedio found successfullly"
        )
       )
    
    })
    
    const updateVideo = asyncHandler(async (req, res) => {
        const { videoId } = req.params
        //TODO: update video details like title, description, thumbnail
     
    
        const myVedio = await Video.findById(videoId)
    
        if(!myVedio ||!(userVedio.owner.toString() === req.user._id.toString())){
            throw new apiError(400,"Cannot find the vedio")
        }
    
        const {title,description} = req.body;
    
        const thumbnail = await req.file?.path
        
        if(!(title && description))
        {
            throw new apiError(400," title and discription required for updation")
        }
        
        if(!thumbnail){
            throw new apiError(400,"for update thumbnail is required")
        }
    
        const updatedthumbnail = await uploadOnCloudinary(thumbnail)
        await deleteOnClodinary(myVedio.thumbnail)
       const newVedio =  await Video.findByIdAndUpdate(videoId
            ,
            {
                $set:{
                    title:title,
                    description:description,
                    thumbnail:updatedthumbnail?.url
                }
            },
            {
                new:true,
            })
    
            return res.status(200).json(
                new apiResponse(
                    200,
                    newVedio,
                    "updated successfully"
                )
            )
    
    
    })
    
    const deleteVideo = asyncHandler(async (req, res) => {
        const { videoId } = req.params
        //TODO: delete video
        
        if(!videoId){
            throw new apiError(400,"Cannot find the vedioid")
        }
        const deleteVedio =  await Video.findById(videoId)
        if(!deleteVedio || !(deleteVedio.owner.toString() === req.user._id.toString())){
            throw new apiError(400,"Cannot find the vedio")
        }
        console.log(deleteVedio.vedioFile);
    
        await deleteOnClodinary(deleteVedio.vedioFile)
    
       await Video.findByIdAndDelete(videoId)
    
            
            return res.status(200).json(
                new apiResponse(
                    200,
                    "updated successfully"
                )
            )
    
        
    })
    
    const togglePublishStatus = asyncHandler(async (req, res) => {
        const { videoId } = req.params
    
        if(!videoId){
            throw new apiError(400,"id not accessable")
        }
    
        const vedioExisted =  await Video.findById(videoId)
        if(!vedioExisted){
            throw new apiError(400,"Vedio doesnot existed")}
    
    
         if(!vedioExisted.owner == req.user?._id)
        {   throw new apiError(400,"Not allowed to toggle")
        }
        // console.log(vedioExisted.isPublished );
        vedioExisted.isPublished = ! Video.isPublished
       await vedioExisted.save({validateBeforeSave: false})
        // console.log( vedioExisted.isPublished);
    
        return res.status(200).json(
            new apiResponse(
                200,
                vedioExisted.isPublished ,
                "check published or not"
    
            )
        )
    
    })
    
    export {
        publishAVideo ,
        getVideoById,
        updateVideo,
        deleteVideo,
        togglePublishStatus,
        getAllVideos,
    };