const express=require("express")
// const verifyJwt = require("../../middleware/verifyJwt")
const { search } = require("../../controller/user/serachController")
const router=express.Router()

router.get("/",search)


module.exports=router