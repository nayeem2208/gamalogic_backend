import axios from "axios"

const passwordHash=async(password)=>{
    try {
        let hasedPassword=await axios.get(`http://64.227.164.87/hashpassword?password=${password}`)
        return hasedPassword.data
    } catch (error) {
        console.log(error)
    }
}

export default passwordHash