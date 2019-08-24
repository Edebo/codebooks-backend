const router=require('express').Router()
const {userById}=require('../controllers/user')
const {isAuth,requireSignin}=require('../controllers/auth')
const {generateToken,payment} =require('../controllers/braintree')
router.get('/braintree/getToken/:userId',requireSignin,isAuth,generateToken)
router.post('/braintree/payment/:userId',requireSignin,isAuth,payment)
router.param('userId',userById)
module.exports=router