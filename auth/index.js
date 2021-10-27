require("dotenv").config()
const jwt =require('jsonwebtoken')
const generateToken=data=>{
    const token=jwt.sign(data,process.env.secret_id,{expiresIn:'2h'})
    return token
}

const authenticateToken=(req,res,next)=>{    
 if(req.headers.cookie){
        const token=(req.headers.cookie).split('=')[1]
        // console.log(token);
        const decode=jwt.verify(token,process.env.secret_id,{ expiresIn: '24h' })
        req.usedata=decode
        next()
    }else{
        req.usedata="cookie is remove"
        next()
    }
}
module.exports={generateToken,authenticateToken}