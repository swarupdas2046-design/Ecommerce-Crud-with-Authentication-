import mongoose from "mongoose";


const ImageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    category:{
        type:String,
        required:true,
    },
    description: {
        type: String,
        required: true,
    },
    price:{
        type:Number,
        required:true
    },
    image: [
        {
            url: { type: String, required: true },
            fileId: { type: String, required: true }
        }
        
    ],
    user:{
        type:String,
    },
},{
    timestamps: true
});

export const ImageModel = mongoose.model("Product",ImageSchema)