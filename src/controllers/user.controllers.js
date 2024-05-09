import {asyncHandler} from "../utils/asyncHandler.js" ;//this is used for  handling the error by using utils funnction
import  {apiError} from "../utils/apiError.js"
import {User} from "../models/user.models.js"
import {uploadOnCloudinary} from "../utils/cloudnary.js"
import {apiResponse} from "../utils/apiResponse.js"

//generating a function for creating accesstoken and refreshtoken

const generateAccessTokenAndRefreshToken = async(userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;

        await user.save({validateBeforeSave :  false});

        return {accessToken , refreshToken};
        
    } catch (error) {
        console.log(error.message); // Log the error before throwing
        throw new apiError(500, "Something went wrong while generating access and refresh token");
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
    const coverImageLocalPath  =  req.files?.coverImage[0]?.path
    // let coverImageLocalPath ;
    // if(req.file && Array.isArray( req.files.coverImage ) && req.files.coverImage.length > 0){
    //     coverImageLocalPath = req.files.coverImage[0].path
    // }

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

        const isPasswordValid = await user.isPasswordCorrect(password)

        if(!isPasswordValid){
            throw new apiError(400 ,  "Password is incorrect")
        }
        
       const {accessToken , refreshToken} = await generateAccessTokenAndRefreshToken(user._id)
    
       const  loggedInUser = await User.findById(user._id).select("-password -refreshToken")

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
       .clearCookie("accessToken",options)
       .clearCookie("refreshToken" , options)
       .json(
            new apiResponse(200, {} ,"User logged Out sucessfully" )
        )
    }) ;

    const refreshToken = asyncHandler( async(req , res) => {
        const incomingRefreshToken = req.cookie.refreshToken || req.body.refreshToken;
        console.log(incomingRefreshToken)
        if(!incomingRefreshToken){
            throw new apiError(400 , " unauthorized  Access")
        }

       try{ const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
         console.log(decodedToken)
        
        const user = await User.findById(decodedToken?._id)

        if(!user){
            throw new apiError(404 , "User not found")
        }
        if(user.refreshToken !== incomingRefreshToken){
            throw new apiError(401 , "Refresh token is expired")
        }
        const options ={
            httpOnly :true,
            secure :true
        }
        const {accessToken , newRefreshToken }= await generateAccessTokenAndRefreshToken(user._id)

        return res
        .status(200)
        .cookie("accessToken",accessToken ,options)
        .cookie("refreshToken" , newRefreshToken ,options)
        .json(
            new apiResponse(200, {accessToken , newRefreshToken} ,"Acess token is refreshed" )
        )
    }

    catch(error){
        throw new apiError(401 , error?.message || "Unauthorized Access")
    }

    })

    const changeCurrentPassword = asyncHandler(async(req ,res ) => {
        //for this we need to check if the user is logged in or not so wee need to use the auth middleware
        //get the current password from the user
        //check if the current password is correct
        //change the password

        const {oldPassword , newPassword} = req.body
        const user = await findById(req.user._id)
        const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)
        if(isPasswordCorrect){
            throw new apiError(400 , "Current password is incorrect")
        }
        
        user.password = newPassword
        user.save({validateBeforeSave : false}) //validateBeforeSave is used to validate the password before saving it to the database
        
        return res
        .status(200)
        .json(
            new apiResponse(200 , {} ,"Password changed sucessfully")
        )
    })

export {registerUser,
       loginUser,
       logoutUser,
       refreshToken,
       changeCurrentPassword
    };