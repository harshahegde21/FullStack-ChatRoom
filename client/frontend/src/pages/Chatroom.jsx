
// import React from "react";
// import { useState ,useEffect} from "react";
// import socket from "../socket/socket";
// const Chatroom = () => {
//   const [roomDetails, setroomDetails] = useState();
//   const [leaderData,setLeaderdata] = useState([]);


//   useEffect(()=>{
//     socket.on("room-creator-data",(data)=>{
//     setLeaderdata(data)
//     console.log(data);
    
//     })

//    return()=>{
//     socket.off("room-creator-data");
//    }

//   },[])
//   return <div className="room-div">
//     <div className="room-pannel">
//       <b>{leaderData[0]?.username}</b>
//     </div>

//   </div>;
// };
// export default Chatroom;

import React, { useEffect, useState } from "react";
import socket from "../socket/socket.js";

const Chatroom = () => {
  const [leader, setLeader] = useState(null);
  const [roomname,setRoomname] = useState("")
  const roomCode = localStorage.getItem("currentRoomId");

  useEffect(() => {
    if (!roomCode) return;

    // // Join the room on server-side
    socket.emit("join-room-info", { roomCode });

    const handleLeader = (data) =>{
      const users = data.users[0];
      console.log(users);
      const roomname = data.roomname
      console.log(roomname);
      
      setRoomname(roomname);
      setLeader(users);
    }
    socket.on("room-creator-data", handleLeader);

    return () => socket.off("room-creator-data", handleLeader);
  }, [roomCode]);

  return (
    <div className="p-4 flex flex-col items-center justify-center h-full bg-gray-100">
      <div className="w-full md:w-1/2 bg-white p-4 rounded shadow-md">
        <h2 className="text-xl mb-4 font-bold">Room Leader</h2>
        <p className="text-lg">{leader?.username || "Loading..."}</p>
        <p className="text-lg">{roomname || "Loading..."}</p>
      </div>
    </div>
  );
};

export default Chatroom;

