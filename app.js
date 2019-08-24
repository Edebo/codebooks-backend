const express =require('express')
const mongoose =require('mongoose')
const morgan =require('morgan')
const rateLimit=require('express-rate-limit')
const helmet=require('helmet')
const bodyParser =require('body-parser')
const expressValidator=require('express-validator')
const cookieParser=require('cookie-parser')
const cors=require('cors')
const mongoSanitize=require('express-mongo-sanitize')
const xssClean=require('xss-clean')
const app=express()

//set security http header

app.use(helmet())
//using express-rate-limit to prevent brute-force attack
//limit request from the api
const limiter=rateLimit({
    max:100,
    windowMs:60*60*1000,
    message:'Too many request from the ip,try again in an hour'
})
const authRoute=require('./routes/auth')
const userRoute=require('./routes/user')
const categoryRoute=require('./routes/category')
const productRoute=require('./routes/product')
// const paystackRoute=require('./routes/paystack')
const orderRoute=require('./routes/order')
const braintree=require('./routes/braintree')
require('dotenv').config()

//DATABASE CONNECTION
mongoose.connect(process.env.DATABASE || "mongodb://adebowale:adebowale#001@ds023523.mlab.com:23523/heroku_lfd45917",{
    useNewUrlParser:true,
    useCreateIndex:true
}).then(()=>{
    console.log('DATABASE CONNECTED')
})

//middlewares
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(expressValidator())
app.use(cookieParser())
app.use(cors())

//data sanitization against NOsql attack
app.use(mongoSanitize())
//data sanitization against xss attack
app.use(xssClean())
// //making the uploads folder publicly available
// app.use('/uploads', express.static('uploads'));

//ROUTE
app.use('/api',limiter)
app.use('/api',authRoute)
app.use('/api',userRoute)
app.use('/api',categoryRoute)
app.use('/api',productRoute)
// app.use('/api',paystackRoute)
app.use('/api',braintree)
app.use('/api',orderRoute)



//for none existing route

app.use('*',(req,res)=>{
    const err= new Error('Page not found')
    err.status=400
        res.status(err.status||500).json({
            err:err.message|| 'Something went wrong'
        })
})

const port = process.env.PORT || 8000

app.listen(port,()=>{
    console.log(`Server has started on port ${port}`)
})