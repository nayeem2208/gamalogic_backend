import express from 'express'
import Authentication from '../controllers/userAuthController.js';
import APIControllers from '../controllers/APIController.js';
import authcheck from '../middlewares/auth.js';

const router=express.Router()

router.get('/sampleCheck',Authentication.sample)
router.post('/login',Authentication.login)
router.post('/signup',Authentication.registerUser)
router.get('/verifyEmail',Authentication.verifyEmail)
router.post('/googleSignup',Authentication.googleAuth)
router.post('/googleLogin',Authentication.googleLogin)
router.post('/forgotPassword',Authentication.forgotPassword)
router.post('/resetPassword',Authentication.resetPassword)


router.get('/getApiKey',authcheck,APIControllers.getApi)
router.get('/resetApiKey',authcheck,APIControllers.resetApiKey)


export default router;