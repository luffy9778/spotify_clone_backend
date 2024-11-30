const express=require("express")
const upload = require("../../middleware/multer")
const { createPlaylist, deletePlayList, getAllPlaylist, getPlaylistById } = require("../../controller/admin/playlistController")
const router=express.Router()

router.post("/upload",upload.single("image"),createPlaylist)
router.delete("/:id",deletePlayList)
router.get("/",getAllPlaylist)
router.get("/:id",getPlaylistById)

module.exports=router