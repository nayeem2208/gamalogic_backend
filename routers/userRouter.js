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

router.post('/singleEmailValidator',authcheck,APIControllers.emailValidation)
router.post('/singleEmailFinder',authcheck,APIControllers.FindSingleEmail)
router.get('/getAllUploadedEmailValidationFiles',authcheck,APIControllers.getAlreadyCheckedBatchEmailFiles)
router.post('/batchEmailVerification',authcheck,APIControllers.batchEmailValidation)
router.get('/getBatchStatus',authcheck,APIControllers.batchEmailStatus)
router.get('/downloadEmailVerificationFile',authcheck,APIControllers.downloadEmailVerificationFile)
router.get('/getApiKey',authcheck,APIControllers.getApi)
router.get('/resetApiKey',authcheck,APIControllers.resetApiKey)
router.post('/changePassword',authcheck,APIControllers.changePassword)


export default router;