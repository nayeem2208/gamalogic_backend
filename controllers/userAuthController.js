import db from "../config/DB.js";
import generateToken from "../utils/jwt.js";
import jwt from "jsonwebtoken";
import SendVerifyMail from "../utils/nodemailer.js";

const Authentication = {
  // register: async (req, res) => {
  //   try {
  //     let user = await db.query("Select * from user_Table");
  //     console.log(user[0], "user");
  //     res.send(user[0]);
  //   } catch (error) {
  //     console.log(error);
  //     res.status(500).json(error);
  //   }
  // },
  login: async (req, res) => {
    try {
      console.log(req.body, "body");
      const { email, password } = req.body;
      let user = await db.query(
        `SELECT * FROM user_Table WHERE email='${email}' AND password='${password}'`
      );
      if (user[0].length > 0) {
        if (user[0][0].verified == 1) {
          let token = generateToken(res, user[0].id);
          res.json({
            id: user[0][0].id,
            email: user[0][0].email,
            token,
          });
        } else {
          res.status(401).json({ error: "Please verify your email" });
        }
      } else {
        res.status(401).json({ error: "Incorrect email or password" });
      }
    } catch (error) {
      console.log(error);
      res.status(400).json(error);
    }
  },
  registerUser: async (req, res) => {
    const { fullname, email, password } = req.body;
    try {
      let userExists = await db.query(
        `SELECT * FROM user_Table WHERE email='${email}'`
      );
      if (userExists[0].length > 0) {
        res.status(401).json({ error: "User already exists" });
      } else {
        await db.query(
          `INSERT INTO user_Table(id,fullName,email,password,verified)VALUES(null,'${fullname}','${email}','${password}',0)`
        );
        SendVerifyMail(email);
        res.status(200).json("Please check your email for verification");
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "Registration failed", error: error.message });
    }
  },
    googleLogin: async (req, res) => {
      try {
        const token = req.body.credentialResponse.credential;
        const decode = jwt.decode(token);
        const { email,sub } = decode;
        let user=await db.query(`SELECT * FROM user_Table WHERE email='${email}' AND sub='${sub}'` )
        if (user[0].length>0) {
          const token = generateToken(res, user[0][0].id);
          res.status(200).json({
            id: user[0][0].id,
            email: user[0][0].email,
            token,
          });
        } else {
          res.status(400).json({error:"Invalid User , Please Sign up with google to use this Sign in"});
        }
      } catch (error) {
        res.status(400).json(error);

      }
    },
  googleAuth: async (req, res) => {
    try {
      const body_Token = req.body.credentialResponse.credential;
      const decode = jwt.decode(body_Token);
      console.log(decode, "decodeddddddddddddddddddddddd");
      const { name, email, sub } = decode;
      const userExists = await db.query(
        `SELECT * FROM user_Table WHERE email='${email}'`
      );
      if (userExists[0].length > 0) {
        res.status(400).json({ error: "User already exists" });
      }
      else{
        await db.query(
          `INSERT INTO user_Table(id,fullName,email,password,verified,sub)VALUES(null,'${name}','${email}',null,0,'${sub}')`
        );
        let user=await db.query(`SELECT * FROM user_Table WHERE email='${email}' AND sub='${sub}'` )
        if(user[0].length>0){
          const token = generateToken(res, user.id);
          res.json({
            id: user[0][0].id,
            email: user[0][0].email,
            token,
          });
        }
        else{
          res.status(400).json({ error: "Error while adding user with google" });
        }
      }
      
    } catch (error) {
      console.log(error);
      res.status(400).json({ error });
    }
  },
  verifyEmail: async (req, res) => {
    try {
      const userEmail = req.query.email;
      console.log(userEmail, "userEmail for updation");
      const query = `UPDATE user_Table SET verified = 1 WHERE email = ?`;
      await db.query(query, [userEmail]);
      let verifiedUser = await db.query(
        `SELECT * FROM user_Table WHERE email='${userEmail}' AND verified=1`
      );
      if (verifiedUser.length > 0) {
        let token = generateToken(res, verifiedUser[0].id);
        res.json({
          id: verifiedUser[0].id,
          email: verifiedUser[0].email,
          token,
        });
      }
    } catch (error) {
      console.log(error);
      res.status(400).json({ error });
    }
  },
};
export default Authentication;
