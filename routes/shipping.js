const express=require("express")
const knex=require("../database/index")
const router=express.Router()

router.get("/shipping/regions",(req,res)=>{
    knex.select("*").from('shipping_region').then((data)=>{
        res.send(data)
    }).catch((err)=>{
        res.send(err)
    })
})

router.get("/shipping/regions/:shipping_region_id",(req,res)=>{
    knex.select("*").from('shipping_region').where("shipping_region_id",req.params.shipping_region_id).then((data)=>{
        res.send(data)
    }).catch((err)=>{
        res.send(err)
    })
})


module.exports=router