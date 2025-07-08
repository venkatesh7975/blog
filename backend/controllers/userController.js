import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendMail from "../utils/sendEmail.js";


export async function onRegister(req, res) {
  const { email, password } = req.body;

  const  userEmail= await User.findOne({ email });

  if (userEmail) {
    res.json("user already exist");
    return;
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ email: email, passwordhash: hashedPassword });
  try {
    const result = await user.save();
    sendMail(email)
    res.send(result);
  } catch (err) {
    res.send(err);
  }
}

 export  async function onLogin(req, res) {
  const { email, password } = req.body; //reading the data from client(req.body)
  const user = await User.findOne({ email }); //check whether user exist or not ;
  if (user) {
    //compare the user entered password with encrypted password in the database
    const isMatch = await bcrypt.compare(password, user.passwordhash);
    if (isMatch) {
      //create token
 
      const token = await jwt.sign({ id: user._id }, "secret_key");
      res.json({ token: token }); //sending the success as message
    } else {
      res.json({message:"password not matching "});
    }
  } else {
    res.json({ message: "user not found" });
  }
}


