const User=require('../models/user')
const Order=require('../models/order')
exports.userById=(req,res,next,id)=>{
    User.findById(id).exec((err,user)=>{
        if(err || !user){
            res.status(400).json({
                error:'User not find'
            })
        }
        console.log('i got to userById')
        req.profile=user
        console.log(user)
        next()
    })
}


exports.read=(req,res)=>{
    req.profile.hashed_password=undefined
    req.profile.salt=undefined

    res.json(req.profile)
}

exports.update=(req,res)=>{
    User.findOneAndUpdate({_id:req.profile._id},{$set:req.body},{new:true})
    .then(user=>{
        res.json(user)
    }).catch(err=>{
        res.status(400).json({
            error:'Cannot update user'
        })
    })
}

exports.addCartToUserHistory=(req,res,next)=>{
    let history=[]

    req.body.order.products.forEach((item)=>{
            history.push({
                _id:item._id,
                name:item.name,
                description:item.description,
                category:item.category,
                quantity:item.count,
                transaction_id:req.body.order.transaction_id,
                amount:req.body.order.amount
            })
    })

    User.findByIdAndUpdate(
        {_id:req.profile._id},
        {$push:{history:history}},
        {new:true},
        (error,data)=>{
            if(error){
                return res.status(400).json({
                    error:'Could not update user purchase history'
                })
            }

            next()
    })
}

exports.purchaseHistory=(req,res)=>{
    console.log(req.profile._id)
    console.log('i am inside purchase history')
    Order.find({user:req.profile._id})
    .populate('user','_id name')
    .sort('-createdAt')
    .then(data=>{
        
        return res.json(data)
    }).catch(err=>{
        console.log(err)
            res.json({
                error:'Cannot get user history'
            })
    })
}