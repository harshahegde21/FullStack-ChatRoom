import React, { useEffect, useState } from "react";
import socket from "../socket/socket.js";
import axios from "axios";

const Chatroom = () => {
  const [currcreatorRoom, setcurrcreatorRoom] = useState(null);
  const [joinersData, setjoinersData] = useState([]);  

  const [isCreated, setisCreated] = useState(false);
  const [isJoined, setisJoined] = useState(false);

  // Socket listeners
  useEffect(() => {
    socket.on("room-creator-data", (userData) => {
      setcurrcreatorRoom(userData);
      setisCreated(true);
      setisJoined(false);
    });

    socket.on("room-joiner-data", (userData) => {
      setjoinersData((prev) => [...prev, userData]);
      setisJoined(true);
    });

    return () => {
      socket.off("room-creator-data");
      socket.off("room-joiner-data");
    };
  }, []);

  // Fetch on refresh
  useEffect(() => {
    const getAllUsersfromBackend = async () => {
      try {
        const response = await axios.get("http://localhost:3021/app/getusers", {
          withCredentials: true,
        });
        const data = response.data; // array of objects
        console.log("Users from backend:", data);

        const roomleader = data.find((user) => user.role === "room-creator"); //I will directly get object here
        if (roomleader) {
          setcurrcreatorRoom(roomleader);
          setisCreated(true);
        }

        const roomjoiners = data.filter((user) => user.role === "room-user");
        if (roomjoiners.length > 0) {
          setjoinersData(roomjoiners);
          setisJoined(true);
        }
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    getAllUsersfromBackend();
  }, []);

  return (
    <div className="flex bg-amber-100 p-4">
      <div className="bg-yellow-50 p-4 rounded w-80">
        {currcreatorRoom && isCreated && (
          <div className="creator-div mb-4">
            <p>Room: {currcreatorRoom.roomname || "No information"}</p>
            <p>Room Leader: {currcreatorRoom.username || "No information"}</p>
          </div>
        )}

        {isJoined && joinersData.length > 0 && (
          <div className="joiners-div">
            <p className="font-bold">Room Members</p>
            <ul>
              {joinersData.map((user, index) => (
                <li key={index}>{user.username}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chatroom;
