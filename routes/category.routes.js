const express = require("express")
const {createCategory,deleteCategory,getSingleCategory,updateCategory,categoryOnSearch} = require('../controller/category.controller');
const categoryRoutes = express.Router();

categoryRoutes.post('/v1/createCategory',createCategory);
categoryRoutes.delete('/v1/deleteCategory/:id',deleteCategory);
categoryRoutes.get('/v1/category/:id',getSingleCategory);
categoryRoutes.put('/v1/updateCategory/:id',updateCategory);
categoryRoutes.get('/v1?:parameter',categoryOnSearch);

module.exports = categoryRoutes;
