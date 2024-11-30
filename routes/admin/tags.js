const express=require("express")
const router=express.Router()
const upload=require("../../middleware/multer")
const { addSerchTags, getAllTags } = require("../../controller/admin/tagsController")

router.post("/add",upload.single("image"),addSerchTags)
router.get("/",getAllTags)

module.exports=router