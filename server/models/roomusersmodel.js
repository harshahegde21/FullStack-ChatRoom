import mongoose from "mongoose";

const roomuserSchema = mongoose.Schema({
    username:{
        type:String,
        required:true,
    },
    roomname:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        default:"room-user"
    }
});
const CurrRoomUsers  = mongoose.model("roomusers",roomuserSchema);
export default CurrRoomUsers;
