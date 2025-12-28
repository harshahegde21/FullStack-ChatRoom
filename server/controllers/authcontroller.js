import Users from "../models/usermodel.js"
import bcrypt from "bcrypt";
import { generateToken } from "../middlewares/jwttokenmids.js";
import CurrRoomUsers from "../models/roomusersmodel.js";
import jwt from "jsonwebtoken"

const handleSignup = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    if (!username || !email || !password) {
      return res
        .status(501)
        .json({ status: "error", message: "Provide all details" });
    } else {
      const encrypted_Password = await bcrypt.hash(password, 10);
      const result = await Users.create({
        username,
        email,
        password: encrypted_Password,
      });
      if (result) {
        console.log("User Added Successfully to the database");

        return res.status(200).json({
          status: "success",
          message: "User Created Successfully",
        });
      } else {
        console.log("User not addedd, ERROR");
        return res.status(401).json({
          status: "error",
          message: "User not created",
        });
      }
    }
  } catch (error) {
    console.log("User not addedd, ERROR");

    return res
      .status(501)
      .json({ status: "error", message: "Internal server error" });
  }
};

const handleLogin = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      return res
        .status(401)
        .json({ status: "error", message: "Provide all the details" });
    } else {
      const user = await Users.findOne({ username });
      console.log(user);

      if (user) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
          const token = generateToken(user);
          console.log("Token is ", token);
          await res.cookie("roomtoken", token, {
            httpOnly: true,
            sameSite: "Lax",
            secure: false, 
          });

          console.log("User Logged in successfully");

          return res.status(200).json({
            status: "success",
            message: "User Logged in successfully",
          });
        } else {
          console.log("User Not logged in");
          return res
            .status(400)
            .json({ status: "error", message: "Wrong password" });
        }
      } else {
        console.log("User NOt found");

        return res
          .status(400)
          .json({ status: "error", message: "cant find user" });
      }
    }
  } catch (error) {
    console.log("Not logged in Internal Error");

    return res
      .status(500)
      .json({ status: "error", message: "Internal Server Error" });
  }
};

const handleSignout = async (req, res) => {
  // pass as of now
  const token = await req.cookies.roomtoken;
  console.log(token);

  const decodedData = jwt.verify(token, process.env.SECRET_KEY);
  try {
    if (decodedData) {
      const { username, email } = decodedData;
      const user = await Users.findOneAndDelete({ username, email });
      if (user) {
        console.log(`${username} signed out successfully`);
        return res
          .status(200)
          .json({ status: "success", message: `${user} got deleted` });
      } else
        return res
          .status(404)
          .json({ status: "error", message: `${user} not found` });
    } else
      return res
        .status(404)
        .json({ status: "error", message: `NO user exits` });
  } catch (error) {
    return res
      .status(501)
      .json({ status: "error", message: `Internal server error` });
  }
};

const handleLogout = async (req, res) => {
  console.log("Logout: ", req.cookies.roomtoken);
  res.clearCookie("roomtoken", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });

  console.log("Logged out Successfully");
  return res
    .status(200)
    .json({ status: "success", message: "Logged out Successfully" });
};

export {
    handleSignup,
    handleLogin,
    handleSignout,
    handleLogout
}