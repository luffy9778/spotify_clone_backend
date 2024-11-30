const express=require("express")
const verifyJwt = require("../../middleware/verifyJwt")
const { getUser } = require("../../controller/user/userController")
const router=express.Router()

router.get("/",verifyJwt,getUser)


module.exports=router