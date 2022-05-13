const db = require('../models/');
const {createSlug} = require("../utils/helper");
const ErrorHandler = require("../utils/errorHandler");
const CatchAsyncError = require("../middleware/catchAsyncError");
let Category = db.category;

// creating the category
exports.createCategory = CatchAsyncError(async(req,res,next)=>{
  if(req.body.slug === undefined){
      req.body.slug =  req.body.title
  }
  let category = new Category({title:req.body.title,slug:createSlug(req.body.slug)})
  await category.save((err,cate)=>{
        if(err){
             return res.status(500).send({message:err});
        }
        return res.status(200).send({message:"Category Saved Successfully!!!"});
  })

})

// deleting the category
exports.deleteCategory = CatchAsyncError(async(req,res,next)=>{

  await Category.findByIdAndDelete(req.params.id)
  .then((cat)=>{
        if(!cat){
            return next(new ErrorHandler("Category Not Found!!",404))
        }
        return res.status(200).send({message:"Category Deleted Successfully"})
  })
  .catch((err)=>{
      return next(new ErrorHandler(err,500))
  })

})

// getting the Single category

exports.getSingleCategory =CatchAsyncError(async(req,res,next)=>{
  let category;
  if(req.params.id === 'all'){
     category = await Category.find({}).then((category)=>category).catch((err)=> next(new ErrorHandler(err,500)))
  }
  else{
    category = await Category.find({_id:req.params.id}).then((category)=>category).catch((err)=> next(new ErrorHandler(err,500)))
  }
  if(category.length === 0){
      return next(new ErrorHandler("Category Not found",404))
  }

  return res.status(200).send(category)

})

// search the category
exports.categoryOnSearch = CatchAsyncError(async(req,res,next)=>{
  const result = await Category.aggregate([{ $match: { 'title': {'$regex' : req.query.title, '$options' : 'i'} } }]).then((category)=>category).catch((err)=> next(new ErrorHandler(err,500)))
  if(result.length === 0){
      return next(new ErrorHandler("Category Not found",404))
  }
  return res.status(200).send({category:result})

})
// update the Category
exports.updateCategory = CatchAsyncError(async(req,res,next)=>{
  if(req.body.slug === undefined){
      req.body.slug =  req.body.title
  }
  let updatedCategory;
  updatedCategory = await Category.findOneAndUpdate({_id:req.params.id},{title:req.body.title,slug:createSlug(req.body.slug)}).then((category)=>category).catch((err)=>{return res.status(500).send({message:err})})
  if(updatedCategory === null){
      return next(new ErrorHandler("Category Not found",404))
  }
  return res.status(200).send("Category Updated Successfully")
})
