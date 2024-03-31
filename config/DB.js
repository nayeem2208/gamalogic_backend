import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const password=process.env.SQLPASSWORD

const mySqlPool=mysql.createPool({
    host:"localhost",
    user:"root",
    password:password,
    database:"user"
})


export default mySqlPool


