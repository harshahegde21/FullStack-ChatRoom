
// import React, { useContext, useState, useEffect } from "react";
// import { UserContext } from "../context/UserProvider.jsx";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import socket from "../socket/socket.js";
// import { getUserFromLocalStorage } from "../utils/LocalStroageSetup.js";

// const Homepage = () => {
//   const { userData, setuserData } = useContext(UserContext);
//   const [allusersData, setallusersData] = useState([]);
//   const [loggedUsers, setloggedUsers] = useState({
//     username: "Not Found",
//     email: "Not found",
//     password: "Not Found",
//   });
//   const navigate = useNavigate();

//   // Logout
//   const handleLogout = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(
//         "http://localhost:3021/app/logout",
//         {},
//         { withCredentials: true }
//       );
//       if (response.data.status === "success") {
//         navigate("/login");
//       }
//     } catch (error) {
//       alert("Not Logged out");
//     }
//   };

//   // Signout
//   const handleSignout = async () => {
//     try {
//       const response = await axios.post(
//         "http://localhost:3021/app/signout",
//         {},
//         { withCredentials: true }
//       );
//       if (response.data.status === "success") {
//         alert("Signed Out Successfully");
//         navigate("/signup");
//       } else alert("Can't Signout the user");
//     } catch (error) {
//       alert("Error in signout");
//     }
//   };

//   const generateShortroomCode = ()=>{
//     const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; 
//     let id = ""
//     for(let i=0;i<6;i++){
//       id+=chars.charAt(Math.random()*chars.length)
//     }
//     return id;
//   }
//   // Get user from local storage on mount
//   useEffect(() => {
//     const currLoggedUser = getUserFromLocalStorage();
//     if (currLoggedUser) {
//       setloggedUsers({
//         username: currLoggedUser.username,
//         email: currLoggedUser.email,
//         password: currLoggedUser.password,
//       });
//     }
//   }, []);

//   // Listen for users data from backend
//   useEffect(() => {
//     const handleUsersData = (alldata) => setallusersData(alldata);
//     socket.on("users-data", handleUsersData);

//     return () => {
//       socket.off("users-data", handleUsersData);
//     };
//   }, []);

//   // Create Room
//   const createRoom = () => {
//     const roomname = prompt("Enter the room name");
//     if (!roomname) return alert("Room name cannot be empty");
//     const roomCode =  generateShortroomCode();
//     socket.emit("create-room", { username: loggedUsers.username, room: roomname ,roomCode:roomCode});
//     navigate("/chatroom");
//   };

//   // Join Room
//  const joinRoom = () => {
//   const roomCode = prompt("Enter the 6-digit room code to join");
//   if (!roomCode) return alert("Please enter the room code");

//   const roomExists = !!allusersData[roomCode]; // check if roomCode exists
//   if (roomExists) {
//     const roomId = allusersData[roomCode].roomId; // get internal roomId
//     socket.emit("join-room", { username: loggedUsers.username, roomId:roomId,roomCode:roomCode });
//     navigate("/chatroom");
//   } else {
//     alert("Room does not exist");
//   }
// };

//   return (
//     <div className="h-full w-full flex flex-col md:flex-row">
//       {/* Sidebar */}
//       <div className="sidebar shadow-md bg-blue-500 w-full md:w-1/3 p-4">
//         <p className="text-xl mb-4 font-semibold">User Account</p>
//         {loggedUsers ? (
//           <>
//             <h2 className="mb-2">
//               <b>Username:</b> {loggedUsers.username}
//             </h2>
//             <p className="mb-2">
//               <b>Email:</b> {loggedUsers.email}
//             </p>
//           </>
//         ) : (
//           <p>No user Info</p>
//         )}
//         <button
//           className="bg-red-500 shadow-md h-10 w-full mb-2 rounded font-medium cursor-pointer"
//           onClick={handleLogout}
//         >
//           Log Out
//         </button>
//         <button
//           className="bg-red-500 shadow-md h-10 w-full rounded font-medium cursor-pointer"
//           onClick={handleSignout}
//         >
//           Sign Out
//         </button>
//       </div>

//       {/* Main content */}
//       <div className="flex-1 bg-yellow-300 p-4 flex flex-col items-center justify-start">
//         <p className="text-4xl font-bold mb-8 text-center">
//           Welcome {loggedUsers ? loggedUsers.username : "user"}
//         </p>

//         <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto justify-center">
//           <button
//             className="bg-blue-500 h-14 w-full md:w-48 shadow-md rounded font-semibold text-white text-xl cursor-pointer"
//             onClick={createRoom}
//           >
//             Create Room
//           </button>
//           <button
//             className="bg-blue-500 h-14 w-full md:w-48 shadow-md rounded font-semibold text-white text-xl cursor-pointer"
//             onClick={joinRoom}
//           >
//             Join Room
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Homepage;


import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/UserProvider.jsx";
import { useNavigate } from "react-router-dom";
import socket from "../socket/socket.js";
import { getUserFromLocalStorage } from "../utils/LocalStroageSetup.js";

const Homepage = () => {
  const { setuserData } = useContext(UserContext);
  const [allRooms, setAllRooms] = useState({});
  const [loggedUser, setLoggedUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = getUserFromLocalStorage();
    if (user) setLoggedUser(user);
  }, []);

  useEffect(() => {
    const handleRooms = (rooms) => {
      console.log("to"+rooms);
      
      setAllRooms(rooms);
    }
    socket.on("users-data", handleRooms);
    
    return () => socket.off("users-data", handleRooms);
  }, []);

  const generateRoomCode = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let id = "";
    for (let i = 0; i < 6; i++) id += chars.charAt(Math.floor(Math.random() * chars.length));
    return id;
  };

  const createRoom = () => {
    const roomName = prompt("Enter room name:");
    if (!roomName) return;
    const roomCode = generateRoomCode();
    socket.emit("create-room", { username: loggedUser.username, room: roomName, roomCode });
    localStorage.setItem("roomname", roomName);
    localStorage.setItem("roomCode",roomCode)
    navigate("/chatroom");
  };

  const joinRoom = () => {
    const roomCode = prompt("Enter 6-digit room code:");
    if (!roomCode) return;
    const room = allRooms[roomCode];
    console.log(allRooms);
    
    if (!room) return alert("Room does not exist");
    socket.emit("join-room", { username: loggedUser.username, roomId: room.roomId, roomCode });
    localStorage.setItem("currentRoomId", roomCode);
    navigate("/chatroom");
  };

  return (
    <div className="flex flex-col md:flex-row h-full">
      <div className="bg-blue-500 p-4 w-full md:w-1/3 shadow-md">
        <h2 className="text-xl font-semibold mb-4">User Info</h2>
        <p><b>Username:</b> {loggedUser?.username}</p>
        <p><b>Email:</b> {loggedUser?.email}</p>
        <button onClick={() => alert("Logout")} className="mt-4 bg-red-500 p-2 rounded text-white">Logout</button>
      </div>
      <div className="flex-1 p-4 bg-yellow-300 flex flex-col items-center justify-center">
        <h1 className="text-4xl mb-8 font-bold">Welcome {loggedUser?.username}</h1>
        <div className="flex gap-4 flex-col md:flex-row">
          <button onClick={createRoom} className="bg-blue-500 text-white p-4 rounded shadow-md">Create Room</button>
          <button onClick={joinRoom} className="bg-blue-500 text-white p-4 rounded shadow-md">Join Room</button>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
