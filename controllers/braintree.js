const braintree=require('braintree')
require('dotenv').config()


const gateway=braintree.connect({
    environment:braintree.Environment.Sandbox,
    merchantId: process.env.MERCHANT_ID,
    publicKey:process.env.PUBLIC_KEY,
    privateKey:process.env.PRIVATE_KEY
})
exports.generateToken=(req,res)=>{
    console.log('inside braintree')
    gateway.clientToken.generate({},function(err,response){
        if(err){
            res.status(500).send(err)
        }
        res.send(response)

    })
}

exports.payment=(req,res)=>{
    let nonce=req.body.paymentMethodNonce
    let amount=req.body.amount

   // charge

   let newTransaction=gateway.transaction.sale({
       amount:amount,
       paymentMethodNonce:nonce,
       options:{
           submitForSettlement:true
       }
   },(error,result)=>{
       if(error){
           res.status(500).json({
               error
           })
       }
       res.json(result)
   })

}