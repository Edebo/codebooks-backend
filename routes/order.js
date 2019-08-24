const router=require('express').Router()
const {userById,addCartToUserHistory}=require('../controllers/user')
const {requireSignin,isAuth,isAdmin} =require('../controllers/auth')
const {create,list,getStatusValue,updateStatus,orderById}=require('../controllers/order')
const {decreaseQuantity}=require('../controllers/product')


router.post('/order/create/:userId',requireSignin,isAuth,addCartToUserHistory,decreaseQuantity,create)
router.get('/order/list/:userId',requireSignin,isAuth,isAdmin,list)
router.get('/order/status-values/:userId',requireSignin,isAuth,isAdmin,getStatusValue)
router.put('/order/:orderId/status/:userId',requireSignin,isAuth,isAdmin,updateStatus)
router.param('userId',userById)
router.param('orderId',orderById)
module.exports=router