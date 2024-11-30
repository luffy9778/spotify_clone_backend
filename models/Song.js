const mongoose=require("mongoose")
const songSchema=new mongoose.Schema({
    songname:{
        type:String,
        required:true
    },
    songtags:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Tag"
    }],
    songfile_url:{
        type:String,
        required:true
    },
    songimage_publicId:{
        type:String,
        required:true
    },
    artistname:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Artist",
        // required:true
    },
    songimage_url:{
        type:String,
        required:true
    },
    songfile_publicId:{
        type:String,
        required:true
    },
    songbgcolour:{
        type:String,
        required:true
    }
})
module.exports=mongoose.model("Song",songSchema)