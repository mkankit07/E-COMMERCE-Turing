const express=require('express')
const knex=require("../database/index")
const {authenticateToken}=require("../auth/index")
const router=express.Router()

router.get('/products',(req,res)=>{
    knex.select('*').from("product").then((data)=>{
        res.send(data)
    }).catch((err)=>{
        res.send({error:err.message})
    })
})

router.get("/products/search",(req,res)=>{
    const search=req.query.search_data
    console.log(search);
    knex.select('product_id','name','description','price','discounted_price','thumbnail').from('product')
    .where('name','like',`%${search}%`)
    .orWhere('description', 'like',`%${search}%`)
    .orWhere('product_id', 'like', `%${search}%`)
    .then((data)=>{
        res.send(data)
    }).catch((err)=>{
        res.send({error:err.message})
        console.log(err);
    })
})

router.get('/products/:product_id',(req,res)=>{
    knex.select('*').from("product").where("product_id",req.params.product_id).then((data)=>{
        res.send(data)
    }).catch((err)=>{
        res.send(err.massage)
    })
})

router.get('/products/incategory/:category_id',(req,res)=>{
    knex.select('product.product_id','name','description','price','discounted_price','thumbnail')
    .from('product').join('product_category',function(){
        this.on('product.product_id','product_category.product_id')})
        .where('product.product_id',req.params.category_id)
        .then((data)=>{
            res.send(data)
        }).catch((err)=>{
            res.send({error:err.message})
        })
    
})


router.get('/products/indepartment/:department_id',(req,res)=>{
    knex.select('product.product_id','product.name','product.description','product.price','product.discounted_price','product.thumbnail')
    .from('department').join('product',function(){
        this.on('product.product_id','department.department_id')})
        .where('product.product_id',req.params.department_id)
        .then((data)=>{
            res.send(data)
        }).catch((err)=>{
            res.send({error:err.message})
        })   
})

router.get("/products/:product_id/details",(req,res)=>{
    knex.select('product.product_id','name','description','price','discounted_price','thumbnail').from("product").where("product_id",req.params.product_id).then((data)=>{
        res.send(data)
    }).catch((err)=>{
        res.send({error:err.message})
    })
})


router.get('/products/:product_id/locations',(req,res)=>{
    knex.select('category.category_id','category.name','category.department_id','department.name as department_name')
    .from('product')
    .join('category',function(){
        this.on('product.product_id','category.category_id')
    }).join('department',function(){
        this.on('category.category_id','department.department_id')
    }).where('product_id',req.params.product_id).then((data)=>{
        res.send(data)
    }).catch((err)=>{
        res.select({error:err.massage})
    })
})

router.get('/products/:product_id/reviews',(req,res)=>{
    knex.select("*").from('review').where("product_id",req.params.product_id).then((data)=>{
        res.send(data)
    }).catch((err)=>{
        res.send({error:err.massage})
    })
})

router.post("/product/:product_id/review",authenticateToken,(req, res) =>{
   
    // console.log(req.token_data)
    const product_id=req.params.product_id;;
    knex.select('*').from('customer').where('customer_id',product_id).then((data)=>{
        knex('review').insert({
            review: req.body.review,
            rating: req.body.rating,
            product_id: product_id,
            created_on: new Date,
            customer_id: data[0]["customer_id"]
        }).then((data) =>{
            console.log(data)
            res.send(data);
        }).catch((err) =>{
            console.log("something went wrong",err);
            res.send('something went wrong')
        })
    })
})

module.exports=router