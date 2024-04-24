import  mongoose from "mongoose"; // Importing mongoose
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userSchema =new mongoose.Schema(
    {
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
    userSchema.pre("save", async function(next) {
        if(!this.isModified("password")) return next();
        this.password = bcrypt.hash(this.password,10)
        next();

    })
    userSchema.methods.isPasswordCorrect = async function(password){
        return await bcrypt.compare(password, this.password)
    }  // this is used to compare the passwordwith the help of bcrypt method

    userSchema.methods.generateToken = async function(){
        return jwt.sign(
            {
                _id : this._id,
                email : this.email,
                fullname : this.fullname,
                username : this.username,
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn : process.env.ACCESS_TOKEN_EXPIRY,
        
            },
            
        )
    } // this is used to generate the token for the user


    userSchema.methods.generateRefreshToken = async function(){
        return jwt.sign(
            {
                _id : this._id,
               },
            process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn : process.env.REFRESH_TOKEN_EXPIRY,
        
            },
            
        )
    } // this is used to generate the refresh token for the user
export const User = mongoose.model("User",userSchema); // Exporting User