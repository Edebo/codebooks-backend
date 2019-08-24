const User =require('../models/user')
require('dotenv').config()
const paystack=require('paystack')(process.env.PAYSTACK_SECRET)


exports.initialize=(req,res)=>{
    const form={}
    form.email=req.auth.email,
    form.amount=req.body.amount*100

    const MySecretKey = `Bearer ${process.env.PAYSTACK_SECRET}`;
    const options = {
        url : 'https://api.paystack.co/transaction/initialize',
        headers : {
            authorization: MySecretKey,
            'content-type': 'application/json',
            'cache-control': 'no-cache'    
        },
        form
}

        const callback = (error, response, body) => {
            
                if(error){
                    //handle errors
                    console.log(error);
                    return res.redirect('/error')
                   
                }
                response = JSON.parse(body);
                // res.redirect(response.data.authorization_url)    
                console.log(response)
        }

        console.log('inside initialize')
        //this is where the real call to paystack is......
    req.post(options,callback)

}