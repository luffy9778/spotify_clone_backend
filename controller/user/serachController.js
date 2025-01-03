const Song = require("../../models/Song")
const Artist = require("../../models/Artist")
const Playlist = require("../../models/Playlist")

const search=async(req,res)=>{
    try {
        const query=req.query.q
        console.log(req.query)
        console.log(req.query.q)
        console.log(query)
    if(!query){
        return res.status(400).json({message:"Please enter a search query"})
    }
    const[songs,artists,playlists]=await Promise.all([
        Song.find({songname:{$regex:query,$options:"i"}}).populate("artistname","artistname"),
        Artist.find({artistname:{$regex:query,$options:"i"}}),
        Playlist.find({palylistname:{$regex:query,$options:"i"}}),
    ])
    res.status(200).json({songs,artists,playlists})
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"server error"})
    }
}

module.exports={search}