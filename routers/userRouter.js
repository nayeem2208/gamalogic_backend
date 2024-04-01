import express from 'express'
import Authentication from '../controllers/userAuthController.js';

const router=express.Router()

router.post('/login',Authentication.login)
router.post('/signup',Authentication.registerUser)
router.get('/verifyEmail',Authentication.verifyEmail)
router.post('/googleSignup',Authentication.googleAuth)
router.post('/googleLogin',Authentication.googleLogin)

export default router;