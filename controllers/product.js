const Product=require('../models/product')
const formidable=require('formidable')
const fs=require('fs')
const _ = require('lodash')

exports.create=(req,res)=>{
console.log('i got here')
    let form =new formidable.IncomingForm()
    form.keepExtensions=true
    // form.uploadDir = "./uploads"
    form.parse(req,(err,fields,files)=>{
        if(err){
           return res.status(400).json(
                {
                    error:'Image cannot be uploaded'
                }
            )
        }
    const {name,description,price,shipping,category,quantity}=fields

        if(!name || !description || !price || !shipping || !category || !quantity){
            console.log('i stopped here')
         return res.status(400).json({
                error:'All fields are required'
            })
        }
        console.log('here also')
        let product=new Product(fields)
        console.log(product)
        if(files.photo){

            if(files.photo.size>100000){
              return res.status(400).json({
                    error:'IMage size should be less than 1MB'
                })
            }
            product.photo.data=fs.readFileSync(files.photo.path)
            console.log(product.photo.data)
            product.photo.contentType=files.photo.type
            console.log(product.photo.contentType)
            // console.log(files.photo.name)
            // product.photo=  "uploads/" + files.photo.name;
        }

        console.log(product)
        product.save().then(result=>{
          return res.json({
                result
            })
    }).catch(err=>{
            res.status(400).json({
                error:err
            })
    })
    })
 
}

exports.productById=(req,res,next,id)=>{
    Product.findById(id).exec((err,product)=>{
     
        if(err || !product){
        return    res.status(400).json({
            error:'product not found'
            })
        }
       
        req.product=product
        next()
    })

}

exports.read=(req,res)=>{
    req.product.photo=undefined
    res.json({
        product:req.product
    })
}

exports.remove=(req,res)=>{
    let product=req.product
    product.remove().then(deletedProduct=>{
        res.json({
            deletedProduct,
            message:'Product deleted successfully'
        })
    }).catch(err=>{
        res.status(400).json({
            error:'Product delete was unsuccessful'
        })
    })
}

exports.update=(req,res)=>{
    
    let form =new formidable.IncomingForm()
    form.keepExtensions=true
    // form.uploadDir = "./uploads"
    form.parse(req,(err,fields,files)=>{
        if(err){
            res.status(400).json(
                {
                    error:'Image cannot be uploaded'
                }
            )
        }
    const {name,description,price,shipping,category,quantity}=fields

        if(!name || !description || !price || !shipping|| !quantity){
            res.status(400),json({
                error:'All fields are required'
            })
        }
        let product=req.product
        product=_.extend(product,fields)
        console.log(product)
        if(files.photo){

            if(files.photo.size>100000){
                res.status(400).json({
                    error:'IMage size should be less than 1MB'
                })
            }
            product.photo.data=fs.readFileSync(files.photo.path)
            console.log(product.photo.data)
            product.photo.contentType=files.photo.type
            console.log(product.photo.contentType)
            // console.log(files.photo.name)
            // product.photo=  "uploads/" + files.photo.name;
        }

        console.log(product)
        product.save().then(result=>{
            res.json({
                result
            })
    }).catch(err=>{
            res.status(400).json({
                error:err
            })
    })
    })
 
}

/**
 * sell and arrival
 * sell= /products?sortBy=sold&order=desc&limit=4
 * arrival=/products?sortBy=createdAt&order=desc&limit=4
 * if no param are sent ,all products are sent
 */

 exports.list=(req,res)=>{
     let order=req.query.order?req.query.order:'asc'
     let sortBy=req.query.sortBy?req.query.sortBy:'_id'
     let limit=req.query.limit?parseInt(req.query.limit):6

     Product.find()
     .select("-photo")
     .populate('category')
     .sort([[sortBy,order]])
     .limit(limit)
     .exec((err,products)=>{
         if(err){
          return res.status(400).json({
                 error:'could not fetch products'
             }
                 
             )
         }

         res.json(
             products
         )
     })
 }


 /*
 **it will find products based on req product category
 *other products in the same category will be returned
 */
 exports.listRelated=(req,res)=>{
    let limit=req.query.limit?parseInt(req.query.limit):6

    Product.find({_id:{$ne:req.product},category:req.product.category })
    .limit(limit)
    .populate('category','_id name')
    .exec((err,products)=>{
        if(err){
            res.status(400).json({
                error:'products not found'
            })
        }

        res.json({
            products
        })
    })
 }

 exports.listCategories=(req,res)=>{
Product.distinct('category',{},(err,categories)=>{
    if(err || !category){
        res.statu(400).json({
            error:'category cannot be found or an error occured'
        })
    }
res.json(
    categories
)

})
 }


 /**
 * list products by search
 * we will implement product search in react frontend
 * we will show categories in checkbox and price range in radio buttons
 * as the user clicks on those checkbox and radio buttons
 * we will make api request and show the products to users based on what he wants
 */
 

 
exports.listBySearch = (req, res) => {
    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);
    let findArgs = {};
 
    // console.log(order, sortBy, limit, skip, req.body.filters);
    // console.log("findArgs", findArgs);
 
    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === "price") {
                // gte -  greater than price [0-10]
                // lte - less than
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                };
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }
 
    Product.find(findArgs)
        .select("-photo")
        .populate("category")
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: "Products not found"
                });
            }
            res.json({
                size: data.length,
                data
            });
        });
};


//controller for search
exports.listSearch=(req,res)=>{
    //create query onject to hold the search input value and the catgeory
    const query={}

    if(req.query.search){
        query.name={$regex:req.query.search,$options:'i'}
        if(req.query.category && req.query.category!='All'){
            query.category=req.query.category

        }
    }

    Product.find(query).select("-photo").then(products=>{
      return res.json(products)

    }).catch(err=>{
        res.status(400).json(
            {error:'Cannot search product'}
        )

    })

}
exports.photo=(req,res)=>{
    
    if(req.product.photo.data){
        res.set('Content-Type',req.product.photo.contentType)

        return res.send(req.product.photo.data)
    }

   
}

exports.decreaseQuantity=(req,res,next)=>{
    let bulkOps=req.body.order.products.map(item=>{
            return {
                updateOne:{
                    filter:{ _id:item._id},
                    update:{$inc:{quantity:-item.count,sold:+item.count}}
                }
            }
    })

    Product.bulkWrite(bulkOps,{},(error,products)=>{
        if(error){
            return res.status(400).json({
                error:'Cannot update product'
            })
        }
        next()
    })
}