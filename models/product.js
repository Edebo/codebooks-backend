const mongoose =require('mongoose')
const {ObjectId}=mongoose.Schema
const productSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        maxlength:32
    },
   description:{
        type:String,
        required:true,
        maxlength:2000
    },
    price:{
        type:Number,
        required:true,
        trim:true,
        maxlength:32
    },
    category:{
        type:ObjectId,
        ref:'Category',
        required:'true'
    },
    quantity:{
        type:Number,
        required:true
    },
    sold:{
        type:Number,
        default:0
    },
    photo:{
        data:Buffer,
        contentType:String
        // type:String,
        // required:true
    },
    shipping:{
        required:true,
        type:Boolean
    }




},{timestamps:true})

module.exports=mongoose.model('Product',productSchema);