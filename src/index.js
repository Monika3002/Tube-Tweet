// import mongoose from "mongoose"  ; // Importing mongoose
// import { DB_NAME } from "./constants" ; // Importing DB_NAME from constants.js
// require('dotenv').config({path: './.env'})

// require('dotenv').config({path: './env'})
import dotenv from "dotenv"
import connectDB from "./db/index.js";
import {app} from './app.js'
dotenv.config({
    path: './.env'
})

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})












/* import express from "express";
const app = express();
// Connecting to the database  using Iffe function

(async ()=>{
    try{
      await mongoose.connect(`${process.env.DATABASE_URI}/${DB_NAME}`);
      app.on("error",(error) =>{  //error handling while connecting to the database this means it is not connected to the database
        console.log("Error while connecting to the database",error)
        throw error; //throwing the error
      })
      app.listen(process.env.PORT,()=>{  //listening to the port
        console.log(`Server is running on port ${process.env.PORT}`)
      })

    } catch(error){  // this is used to catch the error
        console.log("Error while connecting to the database",error)
    }
})();
*/

