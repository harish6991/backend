const express = require("express");
const {createProducts,readProducts,upadateProducts,deleteProduct,getRelatedProducts,gettingTheFilter} = require('../controller/products.controller');

const productsRoutes = express.Router();
productsRoutes.post('/v1/createProduct',createProducts);
productsRoutes.get('/v1/:id',readProducts);
productsRoutes.put('/v1/:id',upadateProducts);
productsRoutes.delete('/v1/:id',deleteProduct);
productsRoutes.get('/v1/category/:id',getRelatedProducts);
productsRoutes.get('/ref',gettingTheFilter);
module.exports = productsRoutes;
