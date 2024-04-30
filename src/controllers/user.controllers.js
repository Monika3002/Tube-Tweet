import {asyncHandler} from "../utils/asyncHandler.js" ;//this is used for  handling the error by using utils funnction
import  {apiError} from "../utils/apiError.js"
import {User} from "../models/user.models.js"
import {uploadOnCloudinary} from "../utils/cloudnary.js"
import {apiResponse} from "../utils/apiResponse.js"
const registerUser =  asyncHandler( async (req,res) => {
    //we need to create a logic for user registration
    //First we need to get data from the user (frontend)
    //next we need to validate the data- if the data is valid then we need to save the data to the database like the mail is in correct formatt or not
    //now we check if the user already  exists in the database or not
    //check for image and avatar
    //upload the image to the cloudinary
    //create a user entntiy in the database 
    //remove  the token and password from the response
    //send the response to the user
    
    const {fullName, email ,username ,password} = req.body;
    // console.log(fullName, email ,username ,password)
    if([fullName, email ,username ,password].some((field)=>
    field?.trim()===""))
    {
      throw  new apiError(400,"All fields are required")
    }

    const existedUser =User.findOne({
        $or : [{username},{email}]
    })
    if (existedUser){
        throw new apiError(400,"User already exist with same email  or username")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverImageLocalPath  =  req.file?.coverImage[0]?.path

    if(!avatarLocalPath){
        throw new apiError(409,"Aavtar is required")
    }
    const avatar= await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new apiError(400,"Avatar is required")
    }
   
    const user= User.create({
        fullName,
        username:username.toLowerCase(),
        email,password,
        avatar: avatar.url,
        coverImage :coverImage?.url || ""
    })

   const userCreated= user.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!userCreated){
        throw new apiError(500,"Something went wrong on registering the user ")
    }
    return  res.status(201).json(
        new apiResponse(200, createdUser ,"user registered sucessfully" )
    )
});

export {registerUser};