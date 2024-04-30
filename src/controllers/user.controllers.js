import {asyncHandler} from "../utils/asyncHandler.js" ;//this is used for  handling the error by using utils funnction

const registerUser =  asyncHandler( async (req,res) => {
     return res.status(404).json({
        message : "User Registered Successfully "
    })
});

export {registerUser};