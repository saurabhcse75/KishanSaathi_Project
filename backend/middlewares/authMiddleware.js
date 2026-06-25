const jwt= require("jsonwebtoken");

const authMiddleware = (req,res,next) =>{
    const token=req.headers.authorization?.split(" ")[1];

    if(!token){
        return res.status(401).json({message:"No token"});
    }

    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET);  //Finding Out id and Role

        req.user=decoded;
        next();
    }catch(error){
        return res.status(401).json({message:"Invalid token"});
    }
};

module.exports = authMiddleware;