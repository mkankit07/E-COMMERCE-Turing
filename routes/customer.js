const express=require("express")
const knex=require('../database/index')
const {generateToken,authenticateToken}=require('../auth/index')
const { route } = require("./products")
const router=express.Router()

router.put('/customer/update/:customer_id',authenticateToken,(req,res)=>{
    knex('customer')
    .where('customer_id',req.params.customer_id)
    .update(req.body)
    .then((data)=>{
        res.send({'massage':'user update'})
    }).catch((err)=>{
        console.log({error:err.massage})
    })
})

router.get('/customer/:id',authenticateToken,(req,res)=>{
    knex.select("*").from('customer').where("customer_id",req.params.id).then((data)=>{
        res.send(data)
    }).catch((err)=>{
        res.send({error:err.massage})
    })
})

router.post("/customer/register",(req,res)=>{
    if(req.body.email===undefined || req.body.password===undefined ){
        res.send({"suggestion":"email and password both are require"})}
    else{
    knex.select("*").from("customer").where({email:req.body.email,password:req.body.password}).then((data)=>{
        if(data.length<1){
            knex("customer").insert(req.body).then((data)=>{
                res.send({'massage':'data insert'})
            }).catch((err)=>{
                res.send({error:err.massage})
            })
        }else{
            res.send("data already exist")
        }
    })
}
})

router.post('/customer/login',(req,res)=>{
    knex.select('*').from('customer')
    .where({'email':req.body.email,'password':req.body.password})
    .then((data)=>{
        const token = generateToken({"email":data[0].email ,"customer_id":data[0].customer_id})
        console.log(token)
        res.cookie("key",token)
        res.send(data)
    }).catch((err)=>{
        console.log(err)
    })
})


router.put('/customer/address',authenticateToken,(req,res)=>{
    var customer_id = req.body.customer_id;
    console.log(customer_id)
    knex('customer').where('customer_id',customer_id)
    .update({
        'address_1':req.body.address_1,
        'address_2':req.body.address_2,
        'city':req.body.city,
        'region':req.body.region,
        'postal_code':req.body.postal_code,
        'country':req.body.country,
        'shipping_region_id':req.body.shipping_region_id
    }).then((data)=>{
        res.send({'sucess':'user sucessfully update'})
    }).catch((err)=>{
        console.log(err)
    })
})


router.put('/customers/creditCard', authenticateToken, (req, res) => {
    console.log(req.body)
    knex('customer')
        .update({
            'credit_card': req.body.credit_card
        })
        .where('customer_id', req.body.customer_id)
        .then((data) => {
            res.send({ "Done": "data updated successfully!" })
        }).catch((err) => {
            res.send({ err: err.message })
        })
})




module.exports=router