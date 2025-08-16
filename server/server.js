import express from "express";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();
import router from "./router/router.js";
import { buildConnection } from "./db/dbconnection.js";
import { addRoomUsers } from "./controllers/roomcontroller.js";

const app = express();
const server = http.createServer(app);

app.use(
  cors({
    origin: 'http://localhost:5173', // your frontend origin
    credentials: true,               // this is crucial
  })
);
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
server.listen(process.env.PORT, () => {
  console.log(`Server is running on port 3021`);
});

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});
app.use((req, res, next) => {
  req.io = io;
  next();
});

const data = {};
await buildConnection(process.env.MONGO_URL)
  .then(() => console.log("Database connected"))
  .catch((error) => console.log(error + "Database not connected"));

// socket connections and operations
io.on("connection", (socket) => {
  console.log(`Client with id ${socket.id} connected`);
  socket.on("create-room", (userData) => {
    const userName = userData.username;
    const roomname = userData.room;
    if (!data[roomname]) {
      data[roomname] = [];
    }
    data[roomname].push(userData);
    socket.join(roomname);
    if(roomname) addRoomUsers(userName, roomname, "room-creator"); //adding them to database
    console.log(socket + "Room creator joined the room ", roomname);
    io.to(roomname).emit("room-creator-data", userData);
  });
  socket.on("join-room", (userData) => {
    const userName = userData.username;
    const roomname = userData.room;
    socket.join(roomname);
    console.log("Another user joined the room ", roomname);
    addRoomUsers(userName, roomname, "room-user");
    io.to(roomname).emit("room-joiner-data", userData);
  });
  if (data) {
    socket.emit("users-data", data);
  }
});
app.use("/app", router);
