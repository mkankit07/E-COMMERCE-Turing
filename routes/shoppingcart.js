const express = require('express')
const router = express.Router()
const knex = require('../database/index')
const random = require('randomstring')
const { route } = require('./products')

router.get('/genrateUniqId',(req, res) => {
    const cart_id = random.generate({charset: "alphanumeric"})
    console.log(cart_id)
    res.send(`this is your cart_id : ${cart_id}`)

})

router.post("/shoppingcart/add",(req,res)=>{
    knex.select('quantity').from('shopping_cart').where('shopping_cart.cart_id',req.body.cart_id)
    .andWhere('shopping_cart.product_id',req.body.product_id)
    .andWhere('shopping_cart.attributes',req.body.attributes).then((data)=>{
        if(data.length<1){
            knex('shopping_cart')
            .insert({
                'cart_id': req.body.cart_id,
                'product_id': req.body.product_id,
                'attributes': req.body.attributes,
                'quantity': 1,
                'added_on': new Date()
            })   .then(() => {
                knex
                    .select(
                        'item_id','name','attributes', 'shopping_cart.product_id','price','quantity','image' )
                    .from('shopping_cart')
                    .join('product', function () {
                        this.on('shopping_cart.product_id', 'product.product_id')
                    }).then((data)=>{
                    data[0]['subtotal']=data[0]['price']*data[0]['quantity']
                    res.send(data)
                }).catch((err)=>{
                    res.send("wrong")
                })
            }).catch((err)=>{
            res.send("swrong")
            })
        }else{
            res.send({massage:'data already exist'})
        }
    }).catch(err=>{
        console.log(err);
    })
})

router.get("/shoppingcart/:cart_id",(req,res)=>{
    knex.select('item_id','name','shopping_cart.product_id','price','quantity','image').from('product').join("shopping_cart",function(){
        this.on('shopping_cart.product_id','product.product_id')
    }).where('cart_id',req.params.cart_id).then((data)=>{
        res.send(data)
    }).catch((err)=>{
        res.send(err.massage)
    })
})

router.put("/shoppingcart/update/:item_id",(req,res)=>{
    knex.select("*").from('shopping_cart').update({quantity:req.body.quantity}).where("item_id",req.params.item_id).then((data)=>{
        knex.select('item_id',
        'product.name',
        'shopping_cart.attributes',
        'shopping_cart.product_id',
        'product.price',
        'shopping_cart.quantity',
        'product.image').from('shopping_cart').join('product',function(){
            this.on('shopping_cart.product_id','product.product_id')
        }).where('item_id',req.params.item_id).then((data)=>{
            res.send(data)
        }).catch((err)=>{
            res.send(err)
        })

    }).catch((err)=>{
        res.send(err)
    })
})


router.delete("/shoppingcart/empty/:cart_id",(req,res)=>{
    knex.select("*").from('shopping_cart').where('cart_id',req.params.cart_id).del().then((data)=>{
        res.send({massage:"data delete"})
    }).catch((err)=>{
        res.send(err)
    })
})


router.get("/shoppingcart/movetocart/:item_id",(req,res)=>{
    knex.schema.createTable('cart',(table)=>{
        table.increments('item_id').primary();
        table.string('cart_id');
        table.integer('product_id');
        table.string('attributes');
        table.integer('quantity');
        table.integer('buy_now');
        table.datetime('added_on');
    }).then(() => {
        console.log("cart table created s")
     }).catch(() => {
        console.log("cart table is already exists!");
    })
    knex.select('*').from('later').where('item_id', req.params.item_id).then((data) =>{
        // res.send(data)
        console.log(data);
            console.log(data. length);
        if (data.length>0){
            knex('cart').insert(data[0]).then((result) =>{
                knex.select('*').from('later').where('item_id', req.params.item_id).del() .then((done) =>{
                    res.send({"Good": "data move from later to cart successfully!"})
                })
            }).catch((err) =>{
                res.send(err);
            })
        }else{
            res.send({"Error": "this id is not available in shopping_cart"})
        }
    }).catch((err) => {
       res.send(err);
    })
})


router.get('/shoppingcart/totalAmount/:cart_id',(req, res) => {
    knex.select('*').from('shopping_cart').join('product', function () {
        this.on('shopping_cart.product_id', 'product.product_id')
    }).where('shopping_cart.cart_id', req.params.cart_id).then((data) => {
        // res.send(data)
        let dic = {}
        let a = data[0].price * data[0].quantity
        dic.totalAmount = a
        res.send(dic)
    }).catch((err) => { 
        res.send({ err: err.message })
    })
})

router.get('/shoppingcart/savedForLater/:item_id',(req, res) => {
    knex.schema.createTable('later', function(table){
        table.increments('item_id').primary();
        table.string('cart_id');
        table.integer('product_id');
        table.string('attributes');
        table.integer('quantity');
        table.integer('buy_now');
        table.datetime('added_on');
     }).then(() => {
        console.log("later table created successfully....")
     }).catch(() => {
        console.log("later table is already exists!");
    })
    knex.select("*").from('shopping_cart').where('item_id', req.params.item_id).then((data) => {
        // res.send(data)
        knex('later').insert(data[0]).then((data2) => {
            knex.select("*").from('shopping_cart').where('item_id', req.params.item_id).del().then((data3) => {
                res.send({ message: 'data move from shopping cart to save for later' })
            }).catch((err) => {
                res.send({ error: err.message }) })
        }).catch((err) => {
            res.send({ error: err.message })
        })
    }).catch((err) => {
        res.send({ error: err.message })
    })
})


router.get('/shoppingcart/getSaved/:cart_id',(req, res) => {
    knex.select(
        'item_id',
        'product.name',
        'shopping_cart.attributes',
        'product.price').from('shopping_cart').join('product', function () {
            this.on('shopping_cart.product_id', 'product.product_id')
        }).where('shopping_cart.cart_id', req.params.cart_id).then((data) => {
            res.send(data)
        }).catch((err) => {
            res.send({ err: err.message })
        })
})


router.delete('/shoppingcart/removedProduct/:item_id', (req, res) => {
    knex.select('*').from('shopping_cart').where('item_id', req.params.item_id).del().then((data) => {
        res.send({ message: 'product removed successfully from shopping cart' })
    }).catch((Err) => {
        res.send({ err: err.message })
    })
})


module.exports=router