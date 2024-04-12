import axios from "axios";
import db from "../config/DB.js";
import generateUniqueApiKey from "../utils/generatePassword.js";
import ErrorHandler from "../utils/errorHandler.js";
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
      // ErrorHandler("emailValidation Controller", error, req);
      res.status(400).json(error);
    }
  },
};
export default APIControllers;
