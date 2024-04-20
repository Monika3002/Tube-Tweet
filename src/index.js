// import mongoose from "mongoose"  ; // Importing mongoose
// import { DB_NAME } from "./constants" ; // Importing DB_NAME from constants.js
// require('dotenv').config({path: './.env'})

import dotenv from "dotenv"; // Importing dotenv
dotenv.config({
    path: './.env'
}); // Configuring dotenv

import  connectDB  from "./db/index.js" ; // Importing MongoDB from db/index.js    

connectDB(); // Connecting to the database
















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

