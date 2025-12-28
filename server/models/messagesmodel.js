import mongoose from "mongoose";

const messageSchema = mongoose.Schema({
    roomname:{
        type:String,
        required:true
    },
    text:{
        type:String
    },
    time:{
        type:String
    }
})

const Messages = mongoose.model("messages",messageSchema)
export default Messages;