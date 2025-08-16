import { Router } from "express";
import { getAlltheUsers, getLoggedInUser, handleLogin, handleLogout, handleSignout, handleSignup } from "../controllers/roomcontroller.js";
import { verifyToken } from "../middlewares/jwttokenmids.js";
const router  = Router();
router.get("/",(req,res)=>{
    return res.send(`Server running successfully`)
})
// 
router.post("/signup",handleSignup);
router.post("/login",handleLogin);
router.post("/logout",handleLogout);
router.post("/signout",handleSignout);
// 
router.get("/allcookies",(req,res)=>{
    return res.end(req.cookies.roomtoken)
    
})
router.get("/getusers",getAlltheUsers);

router.get("/getloggeduser",getLoggedInUser);

export default router;