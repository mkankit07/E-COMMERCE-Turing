const express=require('express')
const knex=require("../database/index")
const router=express.Router()

router.get("/categories",(req,res)=>{
    knex.select("*").from("category").then((data)=>{
        res.send(data)
    }).catch((err)=>{
        res.send({error:err.message})
    })
})


router.get('/categories/:id',(req,res)=>{
    knex.select("*").from('category').where({"category_id":req.params.id}).then((data)=>{
        res.send(data)
    }).catch((err)=>{
        res.send({error:err.message})
    })
})

router.get('/categories/inproduct/:product_id',(req,res)=>{
    let product_id = req.params.product_id
    knex.select('category.category_id','department_id','name')
    .from('category')
    .join('product_category',function(){
        this.on('category.category_id','product_category.product_id')
    }).where('product_category.product_id',product_id)
    .then((data)=>{
        res.send(data)
    }).catch((err)=>{
        console.log({error:err.message})
    })
})

router.get('/categories/indepartment/:department_id',(req,res)=>{
    const department_id=req.params.department_id
    knex.select('category_id','name','description','department_id')
    .from('category')
    .where('department_id',department_id).then((data)=>{
        res.send(data)
    }).catch((err)=>{
        res.send({error:err.message})
    })
})

module.exports=router