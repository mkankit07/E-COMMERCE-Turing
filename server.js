require("dotenv").config()
const express=require('express')
const port=process.env.port
const app=express()
const department=require('./routes/department')
const category=require("./routes/category")
const attributes=require('./routes/attributes')
const products=require('./routes/products')
const customer=require('./routes/customer')
const orders=require('./routes/ORDER')
const shopping_cart=require('./routes/shoppingcart')
const tax=require("./routes/tax")
const shipping=require("./routes/shipping")

app.use(express.json())
app.use("/",shipping)
app.use("/",shopping_cart)
app.use("/",orders)
app.use("/",department)
app.use("/",customer)
app.use("/",products)
app.use("/",category)
app.use("/",attributes)
app.use("/",tax)
app.get("/",(req,res)=>{
    res.send("server connecting")
})

app.listen(port, ()=>{
    console.log(`server connecting port no. ${port}`);
})