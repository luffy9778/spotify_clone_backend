const mongoose=require("mongoose")
const atristSchema=new mongoose.Schema({
    artistname:{
        type:String,
        required:true
    },
    follwers:{
        type:Number
    },
    composedsongs:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Song"
    }],
    artistimage_publicId:{
        type:String
    },
    artistimage_Url:{
        type:String
    },
    artistbgcolour:{
        type:String
    },
})
module.exports=mongoose.model("Artist",atristSchema)