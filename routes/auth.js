const express=require("express")
const { register, login,logOut, refresh} = require("../controller/authController")
const router=express.Router()

router.post("/register",register)
router.post("/login",login)
router.post("/logout",logOut)
router.get("/refresh",refresh)

module.exports=router