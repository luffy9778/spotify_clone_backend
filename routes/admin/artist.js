const express=require("express")
const upload = require("../../middleware/multer")
const { createArtist, updateArtist, getallArtist, getArtistById, deleteArtist } = require("../../controller/admin/artistController")
const router=express.Router()

router.post("/add",upload.single("image"),createArtist)
router.put("/edit/:id",upload.single("image"),updateArtist)
router.get("/",getallArtist)
router.get("/:id",getArtistById)
router.delete("/:id",deleteArtist)

module.exports=router