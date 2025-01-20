const express=require("express")
const router=express.Router()
const upload=require("../../middleware/multer")
const { addSerchTags, getAllTags, getTagById } = require("../../controller/admin/tagsController")
const verifyJwt = require("../../middleware/verifyJwt")
const verifyRoles = require("../../middleware/verifyRoles")

router.post("/add",verifyJwt,verifyRoles("Admin"),upload.single("image"),addSerchTags)
router.get("/",verifyJwt,verifyRoles("Admin","User"),getAllTags)
router.get("/:id",verifyJwt,verifyRoles("Admin","User"),getTagById)

module.exports=router