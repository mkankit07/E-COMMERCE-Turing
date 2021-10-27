const express=require('express')
const knex=require("../database/index")
const router=express.Router()

router.get("/department",(req,res)=>{
    knex.select("*").from("department").then((data)=>{
        res.send(data)
    }).catch((err)=>{
        res.send({error:err.message})
    })
})


router.get('/department/:id',(req,res)=>{
    knex.select("*").from('department').where({"department_id":req.params.id}).then((data)=>{
        res.send(data)
    }).catch((err)=>{
        res.send({error:err.message})
    })
})



module.exports=router