const {Order,CartItem}=require('../models/order')

exports.create=(req,res)=>{
    req.body.order.user=req.profile

    const order=new Order(req.body.order)
    order.save((error,data)=>{
        if(error){
            return res.status(400).json({
                error:'cannot save order.Try again'
            })

            
        }
        res.json(data)
    })
}

exports.list=(req,res)=>{
    Order.find()
    .populate('user','_id name email')
    .sort('-created')
    .exec((error,orders)=>{
        if(error){
            return res.status(400).json({
                error:'cannot get all order'
            })

            
        }
        res.json(orders)
    })
}

exports.getStatusValue=(req,res)=>{
res.json(Order.schema.path('status').enumValues)
}


exports.orderById=(req,res,next,id)=>{
    Order.findById(id)
    .populate('products.product','name price')
    .exec((err,order)=>{
            if(err || !order){
                return res.json({
                    error:'order cannot be found or an error occurred'
                })
            }

            req.order=order
            next()
    })
}
exports.updateStatus=(req,res)=>{
    Order.update({_id:req.body.orderId},{$set:{status:req.body.status}},(err,order)=>{
            if(err){
           return  res.status(400).json({
                    error:'cannot update order'
                })
            }

            res.json(order)
    })
}