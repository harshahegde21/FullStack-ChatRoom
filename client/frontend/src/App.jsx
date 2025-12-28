import React, { createContext, useState } from "react";
import Signup from "./pages/Signup.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import { Route, Routes, Router, BrowserRouter } from "react-router-dom";
import Loginpage from "./pages/Loginpage.jsx";
import Homepage from "./pages/Homepage.jsx";
import { UserProvider } from "./context/UserProvider.jsx";
import Chatroom from "./pages/Chatroom.jsx";
const App = () => {
  return (
    <UserProvider>
        <Routes>
          <Route path="/" element={<LandingPage/>} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Loginpage />} />
          <Route path="/home" element={<Homepage />} />
          <Route path="/chatroom" element={<Chatroom/>}/>
          <Route/>
        </Routes>
     </UserProvider>
 
  );
};

export default App;
