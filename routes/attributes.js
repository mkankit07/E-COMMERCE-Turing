const express=require("express")
const knex=require("../database/index")
const router=express.Router()

router.get("/attributes",(req,res)=>{
    knex.select("*").from("attribute").then((data)=>{
        res.send(data)
    }).catch((err)=>{
        res.send({error:err.message})
    })
})


router.get("/attributes/:id",(req,res)=>{
    knex.select("*").from("attribute").where("attribute_id",req.params.id)
    .then((data)=>{
        res.send(data)
    }).catch((err)=>{
        res.send({error:err.message})
    })
})



router.get('/attributes/value/:attributes_id',(req,res)=>{
    knex.select('attribute_value_id','value').from('attribute_value')
    .where('attribute_value_id',req.params.attributes_id).then((data)=>{
        res.send(data)
    }).catch((err)=>{
        res.send({error:err.message})
    })

})

router.get("/attributes/inproduct/:product_id",(req,res)=>{
    knex.select("name",'attribute_value.attribute_value_id','attribute_value.value')
    .from('attribute_value')
    .join('attribute',function(){
        this.on('attribute_value.attribute_id','attribute.attribute_id')
    })
    .where('attribute.attribute_id',req.params.product_id).then((data)=>{
        res.send(data)
    }).catch((err)=>{
        res.send({error:err.message})
    })
})

module.exports=router