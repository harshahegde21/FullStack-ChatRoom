import RoomDetails from "../models/roomusersmodel.js";
import Messages from "../models/messagesmodel.js";

// add the room users to db
const addRoomUsers = async (username,socketId, roomname,roomId, role) => {
  const result = await RoomDetails.create({
    roomname,
    roomId,
    users:[{
      username,
      socketId,
      role
    }]
  })
  if (result) {
    console.log(`${role} added to DB`);
  } else {
    console.log(`${role} not added to DB`);
  }
};

// add chatobject to db
const addMessagesToDB = (msgObj)=>{
  const {roomId,text,sender,time} = msgObj;
  try {
    const result = Messages.create({
      roomId,
      text,
      sender,
      time
    })
    if(result){
      console.log(`${msgObj} added to db`);
    }
    else console.log(`${msgObj} not added to Db`);
    
  } catch (error) {
    console.log("Internal Error in Adding Messages");
    
  }

}

// Get all users of room including creator
const getAlltheUsers = async (roomId) => {
  const room = await RoomDetails.findOne({roomId}) //it returns an array of objects
  const users = room.users
  console.log("ROom users sent to frontend");
  return users;
};

// get the saved messages
const getParticularRoomMessage = async(roomId)=>{
  const result = await Messages.find({roomId})
  console.log(result);
  console.log("these are msgs");
  return result;
}

const endRoom =async (roomId)=>{
  const deltedRoomdetails = await RoomDetails.findAndDelete({roomId});
  if(deltedRoomdetails) return true
  else return false
}

export {
  getAlltheUsers,
  addRoomUsers,
  addMessagesToDB,
  getParticularRoomMessage,
  endRoom
};
