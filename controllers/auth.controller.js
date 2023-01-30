const mongoose = require('mongoose')
const Token = require('../models/token.model.js')
const User = require('../models/user.model.js')
const bcrypt = require('bcrypt');

const saltRounds = 10

const {generateAccessToken} = require('../utils/authHelper')

exports.register = async (req, res)=>{
    try{
        const { email, name, password, age } = req.body.data
        const existedUser = await User.findOne({email})
        if(existedUser){
            return res.status(409).send({error: "Already exists!"})
        }

        const userPass = await bcrypt.hash(password, saltRounds)
        
        await User.create({
            name: name,
            email: email,
            password: userPass,
            age: age
        })
        
        res.status(200).send({message: "Registered!"})
    } catch(err) {
        console.log(err)
        res.status(500).send({ message: "Internal server error", err: err})
    }
}

exports.login = async (req, res)=>{
    try{
        const { email, password } = req.body.data
        const existedUser = await User.findOne({email})
        if(!existedUser){
            return res.status(409).send({error: "User not found!"})
        }

        const verify = bcrypt.compareSync(password, existedUser.password)
        if(!verify){
            return res.status(401).send({error: "Wrong password!"})
        }

        const token = generateAccessToken({id: existedUser._id}, 'access')
        await Token.create({userId: existedUser._id, token: token})
        res.status(200).send({token: token})
    } catch(err) {
        console.log(err)
        res.status(500).send({ message: "Internal server error", err: err})
    }
}
