const mongoose=require("mongoose")
const playlistSchema=new mongoose.Schema({
    palylistname:{
        type:String,
        required:true
    },
    playlistimage:{
        type:String
    },
    playlistbgcolour:{
        type:String
    },
    playlisttags:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Tag"
    }],
    songs:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Song"
    }]
})
module.exports=mongoose.model("Playlist",playlistSchema)