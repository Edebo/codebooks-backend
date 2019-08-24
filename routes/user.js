
const router =require('express').Router()
const {userById,read,update,purchaseHistory}=require('../controllers/user')
const {requireSignin,isAdmin,isAuth} =require('../controllers/auth')

router.get('/secret/:userId',requireSignin,isAuth,(req,res)=>{
    res.json({
        user:req.profile
    })
})

router.get('/user/:userId',requireSignin,isAuth,read)
router.put('/user/:userId',requireSignin,isAuth,update)
router.get('/user/orders/:userId',requireSignin,isAuth,purchaseHistory)
//anytime there is userId in the route the method will run
router.param('userId',userById)

module.exports= router