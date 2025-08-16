import React, { useContext, useState } from "react";
import { UserContext } from "../context/UserProvider.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import socket from "../socket/socket.js";
import { useEffect } from "react";
import { useReducer } from "react";
const Homepage = () => {
  const { userData, setuserData } = useContext(UserContext);
  const [allusersData, setallusersData] = useState(null);
  const [loggedUsers, setloggedUsers] = useState(null);
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3021/app/logout",
        {},
        {
          withCredentials: true,
        }
      );
      const result = response.data;
      if (result.status == "success") {
        navigate("/login");
      }
    } catch (error) {
      alert("Not Logged out");
    }
  };

  useEffect(() => {
    socket.on("users-data", (alldata) => {
      setallusersData(alldata);
    });
  }, []);

  const createRoom = () => {
    const roomname = prompt("Enter the room name");
    socket.emit("create-room", { username: loggedUsers.username, room: roomname });
    navigate("/chatroom");
  };
  const joinRoom = () => {
    const roomname = prompt("Enter the room name to join");
    if (!roomname) {
      alert("Please Enter the roomname to join");
      return;
    }
    if (allusersData[roomname]) {
      socket.emit("join-room", { username: userData.username, room: roomname });
      navigate("/chatroom");
    } else {
      alert("Room Does not Exists");
    }
  };

  const handleSignout = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3021/app/signout",
        {},
        { withCredentials: true }
      );
      const result = response.data;
      if (result.status === "success") {
        alert("Signed Out Successfully");
        navigate("/signup");
      } else alert("Cant SIgnout the user");
    } catch (error) {
      alert("Error in signout");
    }
  };
  useEffect(() => {
  const getLoggedinUser = async () => {
    
    try {
      const { data } = await axios.get(
        "http://localhost:3021/app/getloggeduser",
        { withCredentials: true }
      );

      setloggedUsers(data); // Directly set data from backend
    } catch (error) {
      console.log("No current Logged User");
      localStorage.removeItem("userData"); // Remove old data
    }
  };

  getLoggedinUser();
}, []);

  return (
    <div className="h-full w-full grid grid-cols-2">
      <div className="sidebar shadow-md bg-blue-500 w-50 h-155">
        <div className="">
          <p className="text-xl ml-4">User Account</p>
          {loggedUsers ? (
            <>
              <h2 className="ml-2">
                <b>Username : </b>{" "}
               {loggedUsers ? loggedUsers.username : "no user info"}
              
              </h2>
              <p className="ml-2">
                <b>Email : </b> {loggedUsers ? loggedUsers.email : "no info"}
              </p>
              <p></p>
            </>
          ) : (
            <p className="ml-4">No user Info</p>
          )}
          <button
            className="bg-red-500 shadow-md h-10 w-25 mt-5 ml-8 rounded font-medium cursor-pointer"
            onClick={handleLogout}
          >
            Log Out
          </button>
          <button
            className="bg-red-500 shadow-md h-10 w-25 mt-5 ml-8 rounded font-medium cursor-pointer"
            onClick={handleSignout}
          >
            Sign Out
          </button>
        </div>
      </div>
      <div className="bg-yellow-300 h-154 left- w-253 relative right-101 grid grid-rows-1 ">
        <p className="bg-aber-50 h-8 font-medium ml-86 w-90 text-5xl animate-bounce mt-5">
          Welcome {loggedUsers ? loggedUsers.username : "user"}
        </p>
        <div className="md:flex block md:justify-center ">
          <button
            className="bg-blue-500 h-30 w-90 shadow-md relative bottom-10 ml-90 md:ml-0 rounded font-semibold text-white text-2xl cursor-pointer mr-56"
            onClick={() => {
              loggedUsers ? createRoom() : alert("No User info. Cant create room");
            }}
          >
            Create Room
          </button>
          <button className="bg-blue-500 h-30 w-90 shadow-md  relative bottom-10 rounded font-semibold text-white text-2xl cursor-pointer mb-60">
            Join Room
          </button>
        </div>
      </div>
    </div>
  );
};
export default Homepage;
