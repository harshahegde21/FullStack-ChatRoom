import mongoose from "mongoose";

const roomuserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  socketId: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "room-user",
  },
});

const roomSchema = mongoose.Schema({
    roomname:{
        type:String,
    },
    roomId:{
        type:String
    },
    users:[roomuserSchema],
})
const RoomDetails = mongoose.model("roomdetails", roomSchema);
export default RoomDetails;
