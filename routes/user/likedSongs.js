const express=require("express")
const {getLikedsong, addLikedSongs, removeLikedSongs }= require("../../controller/user/likedSongController")
const verifyJwt = require("../../middleware/verifyJwt")
const router=express.Router()

router.get("/",verifyJwt,getLikedsong)
router.post("/",verifyJwt,addLikedSongs)
router.delete("/",verifyJwt,removeLikedSongs)

module.exports=router