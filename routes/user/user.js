const express=require("express")
const verifyJwt = require("../../middleware/verifyJwt")
const { getUser } = require("../../controller/user/userController")
const { follwArtist, unfollowArtist } = require("../../controller/user/likedArtistController")
const router=express.Router()

router.get("/",verifyJwt,getUser)
router.post("/artist",verifyJwt,follwArtist)
router.delete("/artist/:artistId",verifyJwt,unfollowArtist)


module.exports=router