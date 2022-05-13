const db = require('../models/');
const mongoose = require("mongoose");
const ErrorHandler = require("../utils/errorHandler");
const CatchAsyncError = require("../middleware/catchAsyncError");
let Category = db.category;
let Products = db.products;
// create Products
exports.createProducts =CatchAsyncError(async(req,res,next)=>{
  let products = new Products(req.body)
  await products.save()
  res.status(200).send({message:products})
});
// readProducts
exports.readProducts=CatchAsyncError(async(req,res,next)=>{
  let products;
  if(req.params.id === 'all'){
      products = await Products.find().then((prod)=>prod).catch((err)=> next(new ErrorHandler(err,500)))
  }
  else{
    products = await Products.find({_id:req.params.id}).then((prod)=>prod).catch((err)=> next(new ErrorHandler(err,500)))
  }

  return res.status(200).send({message:products})

})
// update products
exports.upadateProducts = CatchAsyncError(async(req,res,next)=>{
  const id = req.params.id
   Products.findByIdAndUpdate(id,req.body,(err,produ)=>{
      if(err){
        return next(new ErrorHandler(err,500))
      }
      return res.status(200).send({success:true,message:"Product Have been Updated"})
  })


})

// delete product
exports.deleteProduct = CatchAsyncError(async(req,res,next)=>{
    const id = req.params.id
    Products.findOneAndDelete({_id:id},(err,produ)=>{
        if(err){
          return next(new ErrorHandler(err,500))
        }
        if(produ === null){
          return res.status(204).send()
        }
        return res.status(202).send({success:true,message:"Product Have been deleted"})
    })

});

//get the Related Produts
exports.getRelatedProducts = CatchAsyncError(async(req,res,next)=>{
  let data = await Products.find({category:req.params.id}).then((data)=>data).catch((err)=>next(new ErrorHandler(err,500)))
  return res.status(200).send(data);
})
// find the search result  and the filter
exports.gettingTheFilter = CatchAsyncError(async(req,res,next)=>{
  const min =req.query.min;
  const max = req.query.max;
  let product =Category.findOne({slug:req.query.category},(err,category)=>{
        if(err){
          return next(new ErrorHandler(err,500))
        }
       Products.find({category:category._id},(err,data)=>{
            if(err){
                return next(new ErrorHandler(err,500))
            }
            if(min !== undefined & max !==undefined){
              data =data.filter((item)=>{ if(item.price >= min && item.price <= max){ return true}})
              return res.status(200).send(data)
            }
            else{
              return res.status(200).send(data)
            }

       })
  })
})
