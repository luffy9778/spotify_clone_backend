const Artist = require("../../models/Artist");
const Playlist = require("../../models/Playlist");
const Song = require("../../models/Song");
const Tags = require("../../models/Tags");
const User = require("../../models/User");

const getTotalCounts=async(req,res)=>{
    try {
        const userCount=await User.countDocuments({roles:"User"});
        const songsCount=await Song.countDocuments();
        const artistCount=await Artist.countDocuments();
        const playlistCount=await Playlist.countDocuments();
        const tagCount=await Tags.countDocuments();
        res.status(200).json({userCount,songsCount,artistCount,playlistCount,tagCount});
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"serever error"});
    }
}
module.exports={getTotalCounts};