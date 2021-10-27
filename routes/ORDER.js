const express=require("express")
const knex=require('../database/index')
const jwt = require('jsonwebtoken')
const {generateToken,authenticateToken}=require('../auth/index')
const { route } = require("./products")
const router=express.Router()

router.post('/orders', authenticateToken,(req, res) => {
    // console.log(req.userdata);
    knex.select('*')
    .from('product')
    .join('shopping_cart',function(){
        this.on('product.product_id','shopping_cart.product_id')})

        .where('cart_id',req.body.cart_id)       
         .then((data) => {
            var customer_id = req.usedata.customer_id;
            knex("orders").insert({
                "total_amount": data[0].quantity * data[0].price,
                "created_on": new Date(),
                "shipped_on":new Date(),
                "customer_id": customer_id,
                "shipping_id": req.body.shipping_id,
                "tax_id": req.body.tax_id
            }).then((result) => {
                knex("order_detail").insert({
                    "unit_cost": data[0].price,
                    "quantity": data[0].quantity,
                    "product_name": data[0].name,
                    "attributes": data[0].attributes,
                    "product_id": data[0].product_id,
                    "order_id": result[0]
                })
                    .then((resu) => {
                        console.log("resu")
                    }).catch((err) => {
                        console.log(err.message)
                    })

            })
                .then((detail) => {
                    knex.select("*").from("shopping_cart").where("cart_id", req.body.cart_id).delete()
                        .then(() => {
                            res.send({ "order Id": "orders successfully" })
                        }).catch((err) => {
                            res.send(err)
                        })
                }).catch(() => {
                    res.send({ "error": "error in insserting data in orders detail." })
                })
        }).catch((err) => {
            res.send({ "error": err.message })
        }).catch((err) => {
            res.send(err)
            console.log(err);
        })
})

router.get('/orders/:order_id', authenticateToken, (req, res) => {
    knex.select('orders.order_id',
            'product.product_id',
            'order_detail.attributes',
            'product.name as product_name',
            'order_detail.quantity',
            'product.price',
            'order_detail.unit_cost').from('orders')
        .join('order_detail', function() {
            this.on('orders.order_id', 'order_detail.order_id')
        }).join('product', function() {
            this.on('order_detail.product_id', 'product.product_id')
        }).where('orders.order_id', req.params.order_id)
        .then((data) => {
            res.send(data)
        }).catch((err) => {
            res.send({ err: err.message })
        })
})

router.get('/orders/inCustomer/data', authenticateToken, (req, res) => {

    var customer_id = req.usedata.customer_id
    knex.select('*')
    .from('customer')
    .where('customer_id', customer_id)
        .then((data) => {
            res.send(data)
        })
        .catch((err) => {
            res.send({ err: err.message })
        })
})


router.get("/orders/shortDetail/:order_id",authenticateToken,(req,res)=>{
    knex.select('order_id','total_amount', "created_on", "shipped_on", "status", 'product.name').from('orders').join('product',function(){
        this.on('orders.order_id','product.product_id')
    }).where('order_id',req.params.order_id).then((data)=>{
        res.send(data)
    }).catch(err=>{
        res.send(err)
    })
})

module.exports=router