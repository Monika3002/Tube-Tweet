import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";


const app = express();
app.use(cors(  /// cors is a middleware that allows the server to accept requests from the client
  {
    origin: process.env.ORIGIN_PATH,
    credentials: true
  }
));

app.use(express.json({limit:"12kb"})); // This is used to parse the incoming request with JSON payloadsapp
//jab url se data aayenga to app ko batana padega ki vo json data hai by using  following code
app.use(express.urlencoded({extended:true,limit:"16kb"})); // This is used to parse the incoming request with urlencoded payloads
//ek aur jeez agar hm kisi file ko store karna chahte hai to uske liye ham ke public  folder ko use karte hai
app.use(express.static("public")); // This is used to serve static files
app.use(cookieParser()); // This is used to parse the incoming cookies 
export default app;