const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
    }
}


export { asyncHandler }



// this is try catch block to handle the error in the code
//The following code is used to make the  async handler function which is used to handle the error in the code in order to simplyfy
// const asyncHandler =(fn)=>async(req,res,next)=> {
//     try {
//         await fn(req ,res ,next) 
//         }
//     catch(error){
//         res.status(error.status || 500).json({
//             message: error.message || "Something went wrong"
//         })
//     }
// }