import React, { useState } from "react";
import { useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loginpage from "./Loginpage.jsx";
import { useReducer,useContext } from "react";
import { UserContext } from "../context/UserProvider.jsx";
import {setUsertoLocalStorage } from "../utils/LocalStroageSetup.js"
const Signup = () => {
  const {setuserData} = useContext(UserContext);
  const initialStates = {
    username: "",
    email: "",
    password: "",
  };

  const formReducer = (state, action) => {
    switch (action.type) {
      case "UPDATE_FIELD":
        return {
          ...state,
          [action.field]: action.value,
        };
      case "RESET_FORM":
        return action.initialState;
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(formReducer, initialStates);
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const navigate = useNavigate();
  const isValidDatas = () => {
    let isValid  = true;
    if (state.username.length < 1 || !state.username) {
      nameRef.current.textContent = "Please Enter Name";
      isValid = false;
    }
    if (
      state.email.length > 6 &&
      (!state.email || !state.email.includes("@") || state.email==='')
    ) {
      emailRef.current.textContent = "Please Enter valid Email";
      isValid = false;
    }
    if (!state.password || state.password.length < 6) {
      passwordRef.current.textContent =
        "Password length should greater than 5";
      isValid = false;
    }
    return isValid;
  };
  const handleForm = async (e) => {
    e.preventDefault();
    console.log("form Data", state);
    setUsertoLocalStorage(state)
    
    try {
      if (isValidDatas()) {
        const user = {
          username:state.username,
          email:state.email,
          password:state.password
        }
        setuserData(user);
        const response = await axios.post("http://localhost:3021/app/signup", {
          username: state.username,
          email: state.email,
          password: state.password,
        },{withCredentials:true});
        
        const result =  await response.data;
        console.log("Data of FOrm ", state);

        if (result.status == "success") {
          navigate("/home");
        } else alert("User not added", result);
        dispatch({
          type: "RESET_FORM",
          initialState: initialStates,
        });
      }
    } catch(error) {
      // alert("Error in Sending details to backend");
      console.log(error);
    }
  };

  const navigateToLoginpage = (e) => {
    e.preventDefault();
    navigate("/login");
  };

  const handleChange = (e) => {
    console.log(e.target.value);
    dispatch({
      type: "UPDATE_FIELD",
      field: e.target.name,
      value: e.target.value,
    });
  };
  return (
    <div className="grid grid-rows-2 justify-center bg-blue-400 h-228 md:h-150 w-full ">
      <form
        method="POST"
        onSubmit={handleForm}
        className="md:mt-10 mt-50 ml-4 h-110 px-0 bg-white py-20 w-90 shadow-md rounded-xl "
      >
        <h2 className="text-4xl ml-25 font-medium ">Sign up</h2>
        <input
          type="text"
          id="username"
          name="username"
          placeholder="Name"
          className="px-2 py-2 border-1 rounded mt-3 w-60 ml-10"
          value={state.username}
          onChange={handleChange}
        />
        <br />
        <span ref={nameRef} className="text-red-500 ml-10"></span>
        <br />
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Email"
          className="px-2 py-2 border-1 rounded mt-1 w-60 ml-10"
          value={state.email}
          onChange={handleChange}
        />
        <br />
        <span ref={emailRef} className="text-red-500 ml-10"></span>
        <br />
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Password"
          className="px-2 py-2 border-1 rounded mt-1 w-60 ml-10"
          value={state.password}
          onChange={handleChange}
        />
        <br />
        <span ref={passwordRef} className="text-red-500 ml-10"></span>
        <br />

        <button
          id="submit"
          type="submit"
          className="md:ml-32 ml-30 mt-5 px-2 py-1 border-1 rounded-xl cursor-pointer bg-blue-400 text-white"
        >
          Sign in
        </button>
      </form>
      <div className="w-50 ml-10 h-20 mt-160 md:mt-160 mr-40 relative bottom-110 left-16 rounded-xl">
        <p className="text-white">Already Signed up?</p>
        <button
          onClick={navigateToLoginpage}
          className="cursor-pointer ml-5 bg-white h-7 w-25 text-red-400 rounded shadow-md"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default Signup;
