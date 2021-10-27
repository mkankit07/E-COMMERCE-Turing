const express=require("express")
const knex=require("../database/index")
const router=express.Router()

router.get("/tax",(req,res)=>{
    knex.select("*").from('tax').then((data)=>{
        res.send(data)
    }).catch((err)=>{
        res.send({error:err.massage})
    })
})

router.get("/tax/:id",(req,res)=>{
    knex.select("*").from('tax').where("tax_id",req.params.id).then((data)=>{
        res.send(data)
    }).catch((err)=>{
        res.send({error:err.massage})
    })
})

module.exports=router