const router =require('express').Router();


const {signup,signin,signout,users,requireSignin}=require('../controllers/auth')

router.post('/signup',signup)
router.post('/signin',signin)
router.get('/users',users)
router.get('/signout',requireSignin,signout)
module.exports = router;