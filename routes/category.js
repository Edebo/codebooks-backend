const router =require('express').Router()
const {create,categoryById,read,update,remove,getAll}=require('../controllers/category')
const {userById}=require('../controllers/user')
const {requireSignin,isAdmin,isAuth} =require('../controllers/auth')

router.get('/category/list',getAll)
router.post('/category/create/:userId',requireSignin,isAuth,isAdmin,create)
router.get('/category/:categoryId',read)
router.put('/category/:categoryId/:userId',requireSignin,isAuth,isAdmin,update)
router.delete('/category/:categoryId/:userId',requireSignin,isAuth,isAdmin,remove)

//anytime there is userId in the route the method will run
router.param('userId',userById)
router.param('categoryId',categoryById)
module.exports =router