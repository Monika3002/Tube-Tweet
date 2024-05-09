import {v2 as cloudinary} from 'cloudinary';
import fs from "fs" //fs is a file system module that allows you to work with the file system on your computer.

//configuring cloudinary          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

//uploading files to cloudinary
const uploadOnCloudinary  = async(LocalFilePath) => {  
    try{
        if(!LocalFilePath) return null
         const response= await cloudinary.uploader.upload(LocalFilePath,
        {is_tpye:"auto"})
        //file is uploaded to cloudinary
        // console.log("File uploaded successfully",response)
        fs.unlinkSync(LocalFilePath) //remove the local file 
        return response
    }
    catch(err){
        fs.unlinkSync(LocalFilePath) //remove the local file 
        return null
    } 

}


export {uploadOnCloudinary}