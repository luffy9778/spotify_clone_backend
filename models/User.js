const mongoose=require("mongoose")
const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    roles:{
        type:[String],
        default:["User"]
    },
    likedSongs:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Song"
    }],
    artists:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Artist"
    }],
    playlist:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Playlist"
    }],
})
module.exports=mongoose.model("User",userSchema)