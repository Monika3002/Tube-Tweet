import  mongoose from "mongoose"; // Importing mongoose

const userSchema =new mongoose.Schema(
    {
        userId:{
            type : String,
            required : [true,"userId is required"],
            unique : true,
            trim : true,
            lowercase : true,
            index  : true
        },
        username:{
            type : String,
            required : true,
            unique : true,
            trim : true,
            lowercase : true,
        },
        email:{
            type : String,
            required : [true,"email is required"],
            unique : true,
            trim : true,
            lowercase : true,
            index  : true
        },
        fullname:{
            type : String,
            required : true,
            trim : true,
            index  : true
        },
        password:{
            type : String,
            required : [true,"password is required"],       
        },
        watchlist: {
            type : Schema.Types.ObjectId,
            ref : "video",
        },
        refreshToken:{
            type : String,
        },
        avatar:{
            type : String,
            required : true,
        },
        coverImage:{
            type : String,
        }
    },
    {
        timpstamps : true,        
    }
)

export const User = mongoose.model("User",userSchema); // Exporting User