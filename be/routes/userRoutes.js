const express=require("express")
const bcrypt=require("bcrypt")
var jwt = require('jsonwebtoken');
const { UserModel } = require("../models/usermodel")

const userRoutes=express.Router()


userRoutes.post("/signup",async(req,res)=>{
    const {name,email,password}=req.body
   
    try {
        const user= await UserModel.find({email})
    console.log(user)
    if(user.length){
       return res.status(400).send({"msg":"User is Already exists"})
    }else{
if(validatePassword(password)){
    console.log(password)
        bcrypt.hash(password, 2, async(err, hash) =>{
            // Store hash in your password DB.
            if(err){
                res.status(400).send({"err":err})
            }else{
                const data=new UserModel({name,email,password:hash})
               await data.save()
                res.status(200).send({"msg":"user as Signup"})

            }
        });
    }else{
        res.status(400).send({"msg":"Make Stonge password"})
    }
    }
    } catch (error) {
        res.status(400).send({"err":error})
    }
})
userRoutes.post("/signin",async(req,res)=>{
    const {email,password}=req.body
    
    try {
        const user= await UserModel.findOne({email})
        console.log(user)
        if(user){
            bcrypt.compare(password, user.password, (err, result)=> {
                // result == true
                if(result){
                    const token = jwt.sign({ notes: 'user' }, 'app');
                    res.status(200).send({"msg":"Login successfull","token":token})
                }else {
  
                    res.status(400).send({"err":"password does not match"}) 
                }
            });
        }else{
            res.status(400).send({"err":"email not match"})
        }
        
    } catch (error) {
        res.status(400).send({"err":error})
    }
})



module.exports={userRoutes}

//password validation

function validatePassword(password) {
    // Regular expression pattern
    const pattern = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~])(?=.{8,})/;
  
    // Test the password against the pattern
    return pattern.test(password);
  }