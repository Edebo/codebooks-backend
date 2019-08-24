const Category=require('../models/category')
const _= require('lodash')

exports.create=(req,res)=>{
    
    const category = new Category(req.body)

    category.save().then(data=>{
        res.status(200).json({
            data
        })
    }).catch(err=>{
        res.status(400).json({
            error:'Unable to save category'
        })
    })
}

exports.categoryById=(req,res,next,id)=>{
    Category.findById(id).exec((err,category)=>{
        if(err || ! category){
            res.status(400).json({
                error:'Category not found'
            })
        }

        req.category=category
        next()
    })

}

exports.read=(req,res)=>{
    res.json({
        category:req.category
    })
}

exports.update=(req,res)=>{
    const category=req.category
   category.name=req.body.name

   category.save().then(result=>{
       res.json({
           result
       })
   }).cathc(err=>{
       res.status(400).json({
           error:'cannot update the category'
       })
   })
    
}

exports.remove=(req,res)=>{
    const category=req.category
    category.remove((err,deletedCategory)=>{
        if(err){
            res.status(400).json({
                error:'unable to delete '
            })
        }

        res.json({
            message:'category deleted'
        })
    })
}

exports.getAll=(req,res)=>{

    console.log('inside list categories')
    Category.find({}).then(result=>{
    return res.json({
            categories:result
        })
    }).catch(err=>{
        res.status(400).json({
            error:'Cannot get the list of Category'
        })
    })
}