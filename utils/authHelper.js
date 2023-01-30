const fs = require('fs')
const mongoose = require('mongoose')
const path = require('path')

const jwt = require('jsonwebtoken')
const { token } = require('../config')

const privateKey = fs.readFileSync(path.join(__dirname, "..", "private.key"), 'utf8')
const publicKey = fs.readFileSync(path.join(__dirname, "..", "public.key"), 'utf8')

exports.generateAccessToken = (userData, type) =>{
  
    const payload = {
        userData,
        type
    }
    const signOptions = {
        expiresIn: token[type].expiresIn,
        algorithm: "RS256"
    }
   
    return jwt.sign(payload, privateKey, signOptions)
}

exports.isAuth = (req, res, next) => {
    const authHeader = req.get('Authorization')
    if (!authHeader) {
        res.status(401).json({message: "Token not provided"})
        return
    }
    const token = authHeader.replace('Bearer ', '')
    try {
        const payload = jwt.verify(token, publicKey)
        if (payload.type !=='access') {
            res.status(401).json({message: 'Invalid token!'})
        }
        req.payload = payload.payload 
        next()
        
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError){
            console.log("error " + token + " Token expired! ")
            res.status(401).json({message: "Token expired!"})
            return
        }
        if (error instanceof jwt.JsonWebTokenError){
            console.log("error " + token + " Invalid token type")
            res.status(401).json({message: "Invalid token type"})
            return
        }
    }
}
