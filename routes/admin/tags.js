const express=require("express")
const router=express.Router()
const upload=require("../../middleware/multer")
const { addSerchTags, getAllTags } = require("../../controller/admin/tagsController")
const verifyJwt = require("../../middleware/verifyJwt")
const verifyRoles = require("../../middleware/verifyRoles")

router.post("/add",verifyJwt,verifyRoles("Admin"),upload.single("image"),addSerchTags)
router.get("/",verifyJwt,verifyRoles("Admin","User"),getAllTags)

module.exports=router