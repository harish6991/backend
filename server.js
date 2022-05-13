require('dotenv').config({path:'./config/.env'});
const express = require("express");
const app = express()
const bodyParser = require("body-parser");
const connect = require("./config/dbConnect");
const cors = require("cors");
const categoryRoutes = require('./routes/category.routes');
const productsRoutes = require('./routes/products.routes');
const userRoutes = require('./routes/user.routes');
const errorMiddleware   = require('./middleware/error');
const path = __dirname + '/views/';
const {sendConfrimationEmail} = require("./utils/helper");
const {makeCollection,makeRefreshCollection} = require('./controller/roles.controller');
connect()
makeCollection()
makeRefreshCollection()
app.use(cors())
app.use(express.static(path));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/api/category',categoryRoutes);
app.use('/api/products',productsRoutes);
app.use('/api/auth',userRoutes);
app.get('/', function (req,res) {
  res.sendFile(path + "index.html");
});

app.use(errorMiddleware)

app.listen(process.env.PORT,()=>{
    console.log(`The Sever is Running at http://localhost:${process.env.PORT}`)
})
