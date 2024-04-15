import axios from "axios";
import db from "../config/DB.js";
import generateUniqueApiKey from "../utils/generatePassword.js";
import ErrorHandler from "../utils/errorHandler.js";
import { passwordHash, verifyPassword } from "../utils/passwordHash.js";
import CsvToJson from "../utils/CsvConvert.js";
let APIControllers = {
  getApi: async (req, res) => {
    try {
      let apiKey = await db.query(
        `SELECT api_key FROM registration WHERE emailid='${req.user[0][0].emailid}'`
      );
      res.status(200).json({ apiKey: apiKey[0][0].api_key });
    } catch (error) {
      console.log(error);
      ErrorHandler("getApi Controller", error, req);
      res.status(400).json(error);
    }
  },
  resetApiKey: async (req, res) => {
    try {
      let newApiKey = await generateUniqueApiKey();
      console.log(newApiKey, "new api key ");
      let user = await db.query(
        `UPDATE registration SET api_key='${newApiKey}' WHERE emailid='${req.user[0][0].emailid}'`
      );
      console.log(user[0].affectedRows, "user");
      if (user[0].affectedRows === 1) {
        res.status(200).json({ newApiKey });
      }
    } catch (error) {
      console.log(error);
      ErrorHandler("resetApiKey Controller", error, req);
      res.status(400).json(error);
    }
  },
  emailValidation: async (req, res) => {
    try {
      let user = await db.query(
        `SELECT api_key from registration WHERE emailid='${req.user[0][0].emailid}'`
      );
      let apiKey = user[0][0].api_key;
      let validate = await axios.get(
        `https://gamalogic.com/emailvrf/?emailid=${req.body.email}&apikey=${process.env.API_KEY}&speed_rank=0`
      );
      res.status(200).json(validate.data.gamalogic_emailid_vrfy[0]);
    } catch (error) {
      console.log(error);
      ErrorHandler("emailValidation Controller", error, req);
      res.status(400).json(error);
    }
  },
  FindSingleEmail: async (req, res) => {
    try {
      let user = await db.query(
        `SELECT api_key from registration WHERE emailid='${req.user[0][0].emailid}'`
      );
      let nameArray = req.body.fullname.split(" ");
      let firstname = nameArray[0];
      let lastname = nameArray[nameArray.length - 1];
      let apiKey = user[0][0].api_key;
      let find = await axios.get(
        `https://gamalogic.com/email-discovery/?firstname=${firstname}&lastname=${lastname}&domain=${req.body.domain}&apikey=${process.env.API_KEY}&speed_rank=0`
      );
      console.log(find.data, "find result");
      res.status(200).json(find.data);
    } catch (error) {
      console.log(error);
      ErrorHandler("FindSingleEmail Controller", error, req);
      res.status(400).json(error);
    }
  },
  changePassword: async (req, res) => {
    try {
      let { old, newPassword, confirm } = req.body; 
      console.log(old, "old", newPassword, "new", confirm);
      let user = await db.query(
        `SELECT * from registration WHERE emailid='${req.user[0][0].emailid}'`
      );
      const hashedPassword = user[0][0].password;
      let passwordMatch = await verifyPassword(old, hashedPassword);
      if (!passwordMatch) {
        console.log('password match aayilla')
        res.status(400).json({ message: "Old password is not correct" });
      } else {
        let hashedPasswordForDatabase = await passwordHash(newPassword);
        console.log('ivda vare ok')
        await db.query(
          `UPDATE registration SET password='${hashedPasswordForDatabase}' WHERE emailid='${req.user[0][0].emailid}'`
        );
        console.log('add um aayi ')
        res.status(200).json({ message: "Password successfully changed" });
      }
    } catch (error) {
      console.log(error);
      ErrorHandler("changePassword Controller", error, req);
      res.status(400).json(error);
    }
  },
  batchEmailValidation:async(req,res)=>{
    try {
      let user = await db.query(
        `SELECT api_key from registration WHERE emailid='${req.user[0][0].emailid}'`
      );
      let apiKey = user[0][0].api_key;
      const csvFile = 'public/'+req.file.filename
      const jsonArray = await CsvToJson(csvFile);
      const data = {
        "gamalogic_emailid_vrfy": jsonArray.map(item => ({ "emailid": item.emailid }))
      };
      
      let response=await axios.post(`https://gamalogic.com/batchemailvrf?apikey=${process.env.API_KEY}&speed_rank=0`,data)
      res.status(200).json(response.data)
    } catch (error) {
      console.log(error)
      res.status(400).json(error);
    }
  },
  batchEmailStatus:async(req,res)=>{
    try {
      let status=await axios.get(`https://gamalogic.com/batchstatus/?apikey=${process.env.API_KEY}&batchid=${req.query.id}`)
      console.log(status.data,'status')
    } catch (error) {
      console.log(error)
      res.status(400).json(error);
    }
  }
};
export default APIControllers;
