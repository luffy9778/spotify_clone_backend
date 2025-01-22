const express=require("express")
const {getLikedsong, addLikedSongs, removeLikedSongs }= require("../../controller/user/likedSongController")
const verifyJwt = require("../../middleware/verifyJwt")
const verifyRoles = require("../../middleware/verifyRoles")
const router=express.Router()

router.get("/",verifyJwt,verifyRoles("User"),getLikedsong)
router.post("/",verifyJwt,verifyRoles("User"),addLikedSongs)
router.delete("/:songId",verifyJwt,verifyRoles("User"),removeLikedSongs)

module.exports=router