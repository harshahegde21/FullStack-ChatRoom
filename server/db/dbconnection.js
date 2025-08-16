import mongoose from "mongoose"

const buildConnection = async(url)=>{
    await mongoose.connect(url);
}
export {buildConnection}