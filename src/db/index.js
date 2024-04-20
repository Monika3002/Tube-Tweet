import mongoose from "mongoose"; // Importing mongoose
import {DB_NAME} from '../constant.js' // Importing DB_NAME from constants.js
const connectDB = async ()=> {
    try {
      const MongoDB_connection =  await mongoose.connect(`${process.env.DATABASE_URI}/${DB_NAME}`); // Connecting to the database
        console.log(`MongoDB connected successfully ! . Host : ${MongoDB_connection.connection.host}  `);

    }
    catch(error){
        console.log("MongoDB connection failed !!",error)
        process.exit(1)
    }
}

export default connectDB; // Exporting MongoDB