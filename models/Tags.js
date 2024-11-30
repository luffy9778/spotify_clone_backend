const mongoose=require("mongoose")
const tagSchema=new mongoose.Schema({
    tagName:{
        type:String,
        required:true
    },
    tagImage_url:{
        type:String,
        required:true
    },
    tagImage_publicId:{
        type:String,
        required:true
    },
    tagBgcolour:{
        type:String,
        required:true
    }
})
module.exports=mongoose.model("Tag",tagSchema)