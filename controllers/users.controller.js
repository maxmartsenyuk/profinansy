const mongoose = require('mongoose')
const User = require('../models/user.model.js')

exports.getAllUsers = async (req, res)=>{
    try{
        const  {age, sort, filter }  = req.query
        const match = {}
        let sortOrder = null

        if(age && filter && filter !== 'all'){
            const f = filter === "greater" ? "$gt" :  filter === "less" ?  "$lt" : "$eq"
            match.age = { [f] : +age }
        }

        if(sort){
            sort=='desc' ? sortOrder = -1 : sortOrder = 1 
        }

        const users = await User.aggregate()
            .match(match)
            .sort({
                age: sortOrder
            })
            .project({
                _id: false,
                name: "$name",
                email: "$email",
                age: "$age"
            })

        res.status(200).send({message: "Succes", data: users})
    } catch(err) {
        console.log(err)
        res.status(500).send({ message: "Internal server error", err: err})
    }
}

exports.getUser = async(req, res)=>{
    try{
        const  { id }  = req.query
        
        const user = await User.findOne({_id: mongoose.Types.ObjectId(id)})
        .select({
            _id: false,
            name: true,
            email: true,
            age: true
        })
        if(!user){
            return res.status(404).send({message: "User not found"})
        }
        res.status(200).send({message: "Succes", data: user})
    } catch(err) {
        console.log(err)
        res.status(500).send({ message: "Internal server error", err: err})
    }
}