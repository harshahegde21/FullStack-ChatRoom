import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  
    const navigate= useNavigate();
    const navigateToSignup = ()=>{
        navigate("/signup")
    }
    const navigateToLogin = ()=>{
        navigate("/login")
    }
  return (
    <div className="bg-blue-300 h-228 md:h-182 min-w-min">
      <div className="flex justify-center">
        <h1 className="text-4xl font-semibold m-10 animate-bounce">Welcome to Our Discord</h1>
      </div>
      <div className="grid row-span-2 justify-center">
        <p className="text-2xl animate-pulse">Explore with friends! Create Chat Room or Join chat room</p>
        <br />
        <p className="text-xl">Do not have an account?</p><br />
        <button  className="h-10 bg-white cursor-pointer" onClick={navigateToSignup}>Signup</button>
        <p className="text-xl">Already have an Account</p><br />
        <button className="h-10 bg-white cursor-pointer" onClick={navigateToLogin}>Login</button>

      </div>
    </div>
  );
};

export default LandingPage;
