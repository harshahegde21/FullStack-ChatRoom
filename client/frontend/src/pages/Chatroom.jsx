import React, { useEffect, useState } from "react";
import socket from "../socket/socket.js";
import axios from "axios"

const Chatroom = () => {
  const [roomname, setRoomname] = useState("");
  const [roomCode,setroomCode] = useState("");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [user,setUser] = useState({username:"",email:"",password:""});

  const [userName,setuserName] = useState("");

  useEffect(() => {
    if (!roomCode) return;

    // join room
    socket.emit("join-room-info", { roomCode });

    // sending room details to permanently get the room details
    socket.emit("room-code-to-set-IDs",{roomCode,roomId})
    // socket.on("")

    // get room leader data
    socket.on("room-creator-data", (data) => {

    });


    // to close the room
    

    // receive messages
    socket.on("room-messages", (allMessages) => {
      console.log(allMessages);
      setMessages(allMessages)
      
    });

    return () => {
      socket.off("room-creator-data");
      socket.off("room-messages");
    };
  }, [roomCode]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    socket.emit("send-message", {
      roomCode,
      text:newMessage,
      sender:userName,
      time:Date.now().toLocaleString()

    });

    setNewMessage("");
  };

  useEffect(()=>{
    const User =JSON.parse(localStorage.getItem("user"))
    setUser(User)
    const room = localStorage.getItem("roomname");
    console.log(room);
    setRoomname(room)
    
  },[])

  const handleEndRoom =()=>{
   useEffect(()=>{
    alert("ending-room");
    socket.emit("end-room",roomCode);
   },[])
  //  return ()=>{
  //   socket.off("end-room");
  //  }
    
  }

  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">
      <div className="w-full md:w-2/3 bg-white shadow rounded flex flex-col">

        {/* Header */}
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">{roomname}</h2>
          <p className="text-sm text-gray-600">
            Leader: {user?user.username:"loading"}
          </p>
        </div>

        <div>
          <button  className="bg-red-500 text-white px-4 py-2 rounded" onClick={handleEndRoom}>End Room</button>
        </div>
        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-2">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-2 rounded max-w-xs ${
                msg.username === username
                  ? "bg-blue-500 text-white ml-auto"
                  : "bg-gray-200"
              }`}
            >
              <p className="text-xs font-bold">{msg.username}</p>
              <p>{msg.text}</p>
            </div>
          ))}
        </div>

        {/* Input Box */}
        <div className="p-4 border-t flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 border rounded px-3 py-2"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Send
          </button>
        </div>

      </div>
    </div>
  );
};

export default Chatroom;
