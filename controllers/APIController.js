import db from "../config/DB.js";
import generateUniqueApiKey from "../utils/generatePassword.js";
let APIControllers={
    getApi:async(req,res)=>{
        try {
            let apiKey=await db.query(`SELECT api_key FROM registration WHERE emailid='${req.user[0][0].emailid}'`)
            res.status(200).json({apiKey:apiKey[0][0].api_key})
        } catch (error) {
            console.log(error)
            res.status(400).json(error)
        }
    },
    resetApiKey:async(req,res)=>{
        try {
            let newApiKey=await generateUniqueApiKey()
            console.log(newApiKey,'new api key ')
            let user=await db.query(`UPDATE registration SET api_key='${newApiKey}' WHERE emailid='${req.user[0][0].emailid}'`)
            console.log(user[0].affectedRows,'user')
            if(user[0].affectedRows===1){
                res.status(200).json({newApiKey})
            }
        } catch (error) {
            console.log(error)
            res.status(400).json(error)
        }
    }
}
export default APIControllers