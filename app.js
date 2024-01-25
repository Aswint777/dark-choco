const express = require('express')
require('./database/db')
const session=require('express-session')
require('dotenv').config();
const cookieParser = require('cookie-parser')
const path = require('path')
const morgan=require('morgan')
const adminLoginToken = require('./middleware/adminMiddleware')

const app = express()
app.use(express.urlencoded({extended:true}))
app.use(express.json())


// load static asset
app.use(express.static('public'))
app.use(cookieParser())
// app.use('/admin',adminRouter)

// setting view engine 
app.set('view engine','ejs')

const oneDay = 1000*60*60*24
app.use(session({
    secret : 'secret',
    resave : false,
    saveUninitialized : true,
    cookie : {maxAge:oneDay}
}))
app.use(morgan('tiny'))
app.use((req, res, next) => {
    res.setHeader("Cache-Control", "no-store"); 
    next();
});
  

//importing routers
const publicRouter = require('./router/publicRouter')
const userRouter = require ('./router/userRouter')
const adminRouter = require('./router/adminRouter')



// Calling router
app.use('/',publicRouter)
app.use('/user',userRouter)
app.use('/admin', adminRouter)




//port taking from .env
const PORT = process.env.PORT

//listening the port 
app.listen(PORT, ()=>{
    console.log(`http://localhost:${PORT}`)
})