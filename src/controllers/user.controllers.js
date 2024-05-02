import {asyncHandler} from "../utils/asyncHandler.js" ;//this is used for  handling the error by using utils funnction
import  {apiError} from "../utils/apiError.js"
import {User} from "../models/user.models.js"
import {uploadOnCloudinary} from "../utils/cloudnary.js"
import {apiResponse} from "../utils/apiResponse.js"

//generating a function for creating accesstoken and refreshtoken

const generateAccessTokenAndRefreshToken = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken

        user.save({validateBeforeSave :  false})

        return {accessToken , refreshToken}
        
    } catch (error) {
        throw new apiError(500 ,"Something went wrong while generating access and refresh token")
    }

}

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

    const existedUser = await User.findOne({
        $or : [{username},{email}]
    })
    if (existedUser){
        throw new apiError(400,"User already exist with same email  or username")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path
    // const coverImageLocalPath  =  req.file?.coverImage[0]?.path
    let coverImageLocalPath ;
    if(req.file && Array.isArray( req.files.coverImage ) && req.files.coverImage.length > 0){
        coverImageLocalPath = req.files.coverImage[0].path
    }

    if(!avatarLocalPath){
        throw new apiError(409,"Aavtar is required")
    }
    const avatar= await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new apiError(400,"Avatar is required")
    }
   
    const user= await User.create({
        fullName,
        username:username.toLowerCase(),
        email,password,
        avatar: avatar.url,
        coverImage :coverImage?.url || ""
    })

   const userCreated= await  User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!userCreated){
        throw new apiError(500,"Something went wrong on registering the user ")
    }
    return  res.status(201).json(
        new apiResponse(200, userCreated ,"user registered sucessfully" )
    )
});

const loginUser = asyncHandler(async (req,res) => {
        //req.body from the user ->data     
        //check if username or email is coorect
        //validate the user whether it exist in the database or  not
        // check if password is correct
        // generate access token and refresh token 
        // logged in the user

        const {username , password , email } = req.body

        if(!username && !email ){
            throw new apiError(404 , "Username or Email is required ")
        }
        const user = await User.findOne({
            $or : [{username} , {email}]
        })

        if(!user){
            throw new apiError(404 , "Username or Email is not found")
        }

        const isPasswordValid = user.isPasswordCorrect(password)

        if(!isPasswordValid){
            throw new apiError(400 ,  "Password is incorrect")
        }
        
       const {accessToken , refreshToken} = generateAccessTokenAndRefreshToken(user._id)
    
       const  loggedInUser = await User.findById(userId).select("-password -refreshToken")

       const options= {
        httpOnly: true,
        secure : true
       }
       
       return res
       .status(201)
       .cookie("accessToken",accessToken ,options)
       .cookie("refreshToken" , refreshToken ,options)
       .json(
            new apiResponse(200, loggedInUser ,"User logged in sucessfully" )
        )
    });

    const logoutUser = asyncHandler(async (req ,res)=>{
        //refeshtoken and accesstoken ko remove karna  padenga
        await User.findByIdAndUpdate(
            req.user._id,
            {
                $unset : {
                    refreshToken : 1 //remove from the document
                }
            },
            {
                new:true
            }
        )
        const options ={
            httpOnly :true,
            secure :true
        }
        return res
       .status(200)
       .clearCookie("accessToken",accessToken ,options)
       .clearCookie("refreshToken" , refreshToken ,options)
       .json(
            new apiResponse(200, {} ,"User logged Out sucessfully" )
        )
    })

export {registerUser,loginUser,logoutUser};