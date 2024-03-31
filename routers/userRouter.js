import express from 'express'
import Authentication from '../controllers/userAuthController.js';

const router=express.Router()

router.get('/',Authentication.register)
router.post('/login',Authentication.login)
router.post('/signup',Authentication.registerUser)
router.get('/verifyEmail',Authentication.verifyEmail)

export default router;