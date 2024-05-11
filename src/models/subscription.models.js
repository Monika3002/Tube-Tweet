// import mongoose from "mongoose"
import mongoose ,{ Schema } from "mongoose"

const subscriptionSchema = new Schema(
    {
        subscriber:{
            type:Schema.Types.ObjectId,
            ref:"User"
        },
        
        channel:{
            type:Schema.Types.ObjectId,
            ref:"User"
        },
      
    },
    {
        timestamps : true
    })

export const userSubscription = new mongoose.model("Subscription", subscriptionSchema)