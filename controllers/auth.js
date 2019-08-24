const User =require('../models/user')
const jwt =require('jsonwebtoken')
const expressJwt =require('express-jwt')
const {errorHandler}=require('../helpers/dbErrorHandlers')


exports.signup = (req,res) => {
    console.log('i got here')
    console.log(req.body)
    const user =new User(req.body)
    user.save().then(user=>{
        user.salt=undefined
        user.hashed_password=undefined
        res.json({
            user
        })

    }).catch(err=>{
        res.status(400).json({
            // error:'You didnt fill the form properly'
            error:err
        })
    })
   
}

exports.signin=(req,res)=>{

    //find the user based on email
    const {email,password} =req.body
    User.findOne({email}).then(user=>{
            if(!user){
                res.status(400).json({
                    error:'user with the email doesnt exit.Please signup'
                })
            }

            //if user exist then compare email and password
            //create authetication
            if(!user.authenticate(password)){
                //unauthorized
                res.status(401).json({
                    error:'Password doesnt match'
                })
            }
            //generate token with jsonwebtoken using user id and secret key
            const token=jwt.sign({_id:user._id},process.env.JWT_SECRET,{ expiresIn:60400
            }// 1 week
            )
            //persist the token as t in cookies with expiry date
            res.cookie('t',token,{expire:new Date()+9999})

            const {_id,name,email,role}=user
            res.json({
                token,
                user:{
                    _id,name,email,role
                }
            })
    }).catch(err=>{
        res.status(400).json({
            error:'Incorrect password doesnt exit.Please signup'
        })
    })
    
}

exports.signout=(req,res)=>{
    res.clearCookie('t')
    res.json({
        message:'Signout Success'
    })
}

//expressJwt needs cookies middleware to work
//this is for protected route,authorization
exports.requireSignin =(req,res,next)=>{
    try{
        const header = req.headers['authorization'];

        if(typeof header !== 'undefined') {
            const bearer = header.split(' ');
            const token = bearer[1];
    
               //verify the JWT token generated for the user
        const decode =jwt.verify(token,process.env.JWT_SECRET)
        req.auth=decode
            
            next();
        } else {
            //If header is undefined return Forbidden (403)
            res.sendStatus(403)
        }
    }
    catch(e){
        res.status(401).json({
            message:'auth failed'
        })
    }
}



exports.users=(req,res)=>{
    User.find().then(users=>{
        res.json({
            users
        }).catch(err=>{
            res.status(400).json({
                err
            })
        })
    })
}


//this middleware make sure it is the current login user
exports.isAuth=(req,res,next)=>{
    let user=req.profile && req.auth && req.profile._id==req.auth._id
    if(!user){
        res.status(403).json({
            error:'access denied'
        })
    }

    next()
}


//dis for admin verification
exports.isAdmin=(req,res,next)=>{
   if( req.profile.role===0){
       res.status(403).json({
           error:'acess denied'
       })
    }
    next()
   }