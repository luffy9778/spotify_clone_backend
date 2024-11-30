const verifyRoles=(...allowedRoles)=>{
    return (req,res,next)=>{
        if(!req.roles) {
            return res.sendStatus(401)
        }
        const rolesarry=[...allowedRoles]
    const result=req.roles.map(role=>rolesarry.includes(role)).find(val=>val===true)
    if(!result){
        return res.sendStatus(401)
    }
    next()
    }
}
module.exports=verifyRoles