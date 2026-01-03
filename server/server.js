// import express from "express";
// import { Server } from "socket.io";
// import http from "http";
// import cors from "cors";
// import dotenv from "dotenv";
// import cookieParser from "cookie-parser";
// dotenv.config();
// import router from "./router/router.js";
// import { buildConnection } from "./db/dbconnection.js";
// import { addRoomUsers,addMessagesToDB,getParticularRoomMessage, getAlltheUsers } from "./controllers/roomcontroller.js";

// const app = express();
// const server = http.createServer(app);

// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//   })
// );
// app.use(cookieParser());

// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
// server.listen(process.env.PORT, () => {
//   console.log(`Server is running on port 3021`);
// });

// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:5173",
//     methods: ["GET", "POST", "PUT", "DELETE"],
//   },
// });
// app.use((req, res, next) => {
//   req.io = io;
//   next();
// });

// const data = {};

// await buildConnection(process.env.MONGO_URL)
//   .then(() => console.log("Database connected"))
//   .catch((error) => console.log(error + "Database not connected"));

// // socket connections and operations
// io.on("connection", (socket) => {
//   console.log(`Client with id ${socket.id} connected`);

//   socket.on("create-room", (userData) => {
//     const userName = userData.username;
//     const roomname = userData.room;
//     const roomCode = userData.roomCode;
//     const roomId = crypto.randomUUID();
//     if (!data[roomCode]) {
//       data[roomCode] = [];
//     }

//    data[roomCode] = {
//     roomId,
//     roomname, // <-- add this
//     users: [
//       {
//         socketId: socket.id,
//         userName,
//         role: "room-creator"
//       }
//     ]
// };

//     socket.join(roomId);
    
//     if (roomname) addRoomUsers(userName, socket.id,roomname, roomId,"room-creator"); //adding them to database
//     console.log(socket + "Room creator joined the room ", roomname);
//     io.to(roomId).emit("room-creator-data", userData);

//   });
//   socket.on("join-room", (userData) => {
//     const userName = userData.username;
//     const roomId= userData.roomId;
//     const roomCode = userData.roomCode
//     const room = data[roomCode]
//     const roomname = room.roomname

//     socket.join(roomId);
//     console.log("Another user joined the room ", userName);
//     addRoomUsers(userName,socket.id, roomname,roomId, "room-user");
//     io.to(roomId).emit("users",getAlltheUsers(roomId))
//   });
//   if (data) {
//     socket.emit("users-data", data);
//   }

//   // socket.emit("users",getAlltheUsers())

  

//   // to get the sent messages from frontend
//   socket.on("chat-message",async(msgObj)=>{
//     addMessagesToDB(msgObj)
//     const msgs = await getParticularRoomMessage(msgObj.roomname)
//     io.to(msgObj.roomname).emit("room-messages",msgs)
//     console.log(msgs);
    
//   })

// });
// app.use("/app", router);



import express from "express";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import crypto from "crypto";
import router from "./router/router.js";
import { buildConnection } from "./db/dbconnection.js";
import { addRoomUsers, addMessagesToDB, getParticularRoomMessage, getAlltheUsers,endRoom } from "./controllers/roomcontroller.js";

dotenv.config();
const app = express();
const server = http.createServer(app);

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

await buildConnection(process.env.MONGO_URL)
  .then(() => console.log("Database connected"))
  .catch(err => console.log("Database connection error:", err));

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use((req, res, next) => { req.io = io; next(); });
app.use("/app", router);

const roomsData = {};

io.on("connection", socket => {
  console.log("Client connected:", socket.id);

  // Send all room info on connect
  socket.emit("users-data", roomsData);

  // Create Room
  socket.on("create-room", ({ username, room, roomCode }) => {
    const roomId = crypto.randomUUID();
    roomsData[roomCode] = {
      roomId,
      roomname: room,
      users: [{ username, socketId: socket.id, role: "room-creator" }],
    };
    socket.join(roomId);
    addRoomUsers(username, socket.id, room, roomId, "room-creator");
    io.to(roomId).emit("room-creator-data", roomsData[roomCode]);
    io.emit("users-data", roomsData); // update everyone with new room
  });

  // Join Room
  socket.on("join-room", ({ username, roomId, roomCode }) => {
    const room = roomsData[roomCode];
    if (!room) return;

    const roomname = room.roomname;
    room.users.push({ username, socketId: socket.id, role: "room-user" });
    socket.join(roomId);
    addRoomUsers(username, socket.id, roomname, roomId, "room-user");

    io.to(roomId).emit("users", room.users);
    io.emit("users-data", roomsData); // update everyone with room data
  });

  socket.on("room-code-to-set-IDs",(roomdata)=>{
    const roomId = roomdata.roomId;
    const roomCode = roomdata.roomCode;
    io.to(roomId).emit("")
    
  })

  // Get chat messages
  socket.on("send-message", async (msgObj) => {
    
    // addMessagesToDB(msgObj);
    console.log(msgObj);
    
    const room = roomsData[msgObj.roomCode]
    const roomId = room.roomId;
    console.log(room+roomId);
    
    const newMsgobj = {
      roomId:roomId,text:msgObj.text,sender:msgObj.sender,time:msgObj.time
    }
    addMessagesToDB(newMsgobj);
    
    const msgs = await getParticularRoomMessage(roomId);
    console.log(msgs);
    
    io.to(roomId).emit("room-messages", msgs);
  });

  // ending the currently created room
  socket.on("end-room",(roomCode)=>{
    const room = roomsData[roomCode]
    if(room){
      // call the delete that room data from room details and messages
      let isDeleted = endRoom(room.roomId)
      // emit the isDeleted true or false
      socket.emit("room-deleted",isDeleted)
      
    }
    else{
      // emit event of invalid room code
    }
    
  })
});

server.listen(process.env.PORT, () => console.log("Server running on port", process.env.PORT));
