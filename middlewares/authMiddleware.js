const jwt = require("jsonwebtoken");

module.exports = async(req,res,next) =>{
    try {
        const token = req.headers["authorization"].split(" ")[1];
        jwt.verify(token,process.env.JWT_SECRET,(err,decoded)=>{
            if(err){
                return res.status(401).send({
                    message:"Auth failed",
                    status:"error"
                });
            }else{
                req.body.email = decoded.email
                next();
            }
        })
    } catch (error) {
        return res.status(401).send({
            message:"Auth failed",
            status:"error"
        })
    }
}