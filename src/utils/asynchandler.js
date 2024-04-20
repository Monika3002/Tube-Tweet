const asyncHandler = (FuntionHanlder) => (req, res, next) =>{
    return promise.resolve(FuntionHanlder(req, res, next)).catch(next);
}


export {asyncHandler};



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