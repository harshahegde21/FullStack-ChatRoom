import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
});
const RoomUsers = mongoose.model("chatroomusers",userSchema);
export default RoomUsers;