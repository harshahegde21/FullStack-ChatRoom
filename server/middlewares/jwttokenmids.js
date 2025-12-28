import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config();
const generateToken = (user) => {
  const payload = {
    username: user.username,
    email:user.email,
  };
  console.log("payload",payload);
  

  return jwt.sign(payload, process.env.SECRET_KEY);
  
};

const verifyToken = async(req,res,next)=>{
  const token = req.cookies.roomtoken;
 if(token){
  const decodedData = jwt.verify(token,process.env.SECRET_KEY);
  next();
 }
 else{
  return res.json({status:"error"});
 }
}
export { generateToken,verifyToken };
